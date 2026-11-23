import { useForm } from '@tanstack/react-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { parseResponse } from 'hono/client';
import { isNil } from 'lodash-es';
import { DownloadIcon, ExternalLinkIcon, PlusIcon, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { BannerUpload } from '~/components/features/banner-upload';
import { Editor } from '~/components/features/editor';
import { EditorSkeleton } from '~/components/features/page-skeletons';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Fieldset } from '~/components/ui/fieldset';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from '~/components/ui/input-group';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Spinner } from '~/components/ui/spinner';
import { toastManager } from '~/components/ui/toast';
import { useEditor } from '~/hooks/use-editor';
import { countArticleWords, estimateReadingMinutes } from '~/lib/article-utils';
import { hono } from '~/lib/hono';
import { getAdminPost } from '~/server/functions';

interface PostFormData {
  title?: string;
  description?: string;
  slug?: string;
  banner?: string;
  summary?: string;
  published?: boolean;
  htmlContent?: string;
  textContent?: string;
  jsonContent?: any;
  tagIds?: string[];
}

/**
 * 后台文章新建 / 编辑页核心组件。
 *
 * - 传入 `id` 时进入编辑模式，支持 2 秒防抖自动保存与 `Cmd/Ctrl + S` 快捷键保存；
 * - 未传 `id` 时为新建模式，仅在显式提交时创建草稿并跳转到编辑页。
 */
export function UpsertEditor(props: { id?: string }) {
  const { id } = props;
  const editor = useEditor();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  const { data: post, isPending } = useQuery({
    enabled: !isNil(id),
    queryKey: ['admin-post-detail', id],
    queryFn: () => getAdminPost({ data: id! }),
  });

  const { data: tagsRes } = useQuery({
    queryKey: ['tags'],
    queryFn: () => parseResponse(hono.api.tags.$get()),
  });

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const selectedTagIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (post?.data?.tags) {
      const ids = post.data.tags.map((t) => t.id);
      setSelectedTagIds(ids);
      selectedTagIdsRef.current = ids;
    }
  }, [post?.data?.tags]);

  const form = useForm({
    defaultValues: {
      title: post?.data?.title ?? '',
      description: post?.data?.description ?? '',
      slug: post?.data?.slug ?? '',
      banner: post?.data?.banner ?? '',
      summary: post?.data?.summary ?? '',
      published: post?.data?.published ?? false,
    },
    async onSubmit({ value }) {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();
      const jsonContent = editor.getJSON();
      const submitData = {
        ...value,
        htmlContent,
        textContent,
        jsonContent,
        tagIds: selectedTagIdsRef.current,
      };
      if (id) {
        return handleUpdate(submitData);
      }
      return handleCreate(submitData);
    },
  });

  async function handleCreate(submitData: PostFormData) {
    try {
      const resp = await parseResponse(
        hono.api.posts.$post({
          json: submitData,
        }),
      );
      if (resp.data.id) {
        toastManager.add({ type: 'success', title: '文章创建成功' });
        router.navigate({ to: '/studio/posts/upsert/$id', params: { id: resp.data.id } });
      }
    } catch (err) {
      toastManager.add({ type: 'error', title: '文章创建失败' });
      throw err;
    }
  }

  async function handleUpdate(submitData: PostFormData) {
    try {
      const resp = await parseResponse(
        hono.api.posts.$put({
          json: {
            ...submitData,
            id: id as string,
          },
        }),
      );
      if (resp.data.id) {
        toastManager.add({ type: 'success', title: '文章更新成功' });
        setSaveState('saved');
        setLastSavedAt(new Date());
        queryClient.invalidateQueries({ queryKey: ['admin-post-detail', id] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    } catch (err) {
      toastManager.add({ type: 'error', title: '文章更新失败' });
      throw err;
    }
  }

  const autoSave = useCallback(
    async (tagIdsOverride?: string[]) => {
      if (!id) return;

      const formValues = form.state.values;
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();
      const jsonContent = editor.getJSON();

      try {
        setSaveState('saving');
        await parseResponse(
          hono.api.posts.$put({
            json: {
              ...formValues,
              htmlContent,
              textContent,
              jsonContent,
              tagIds: tagIdsOverride ?? selectedTagIdsRef.current,
              id,
            },
          }),
        );
        setSaveState('saved');
        setLastSavedAt(new Date());
      } catch (err) {
        console.error('自动保存失败:', err);
        setSaveState('error');
        toastManager.add({ type: 'error', title: '自动保存失败' });
      }
    },
    [id, editor, form],
  );

  const triggerAutoSave = useCallback(
    (tagIdsOverride?: string[]) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        void autoSave(tagIdsOverride);
      }, 2000);
    },
    [autoSave],
  );

  useHotkeys(
    'mod+s',
    (e) => {
      e.preventDefault();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      void autoSave();
    },
    {
      enableOnFormTags: true,
      enableOnContentEditable: true,
      preventDefault: true,
    },
  );

  useEffect(() => {
    if (!editor) return;

    const updateCount = () => {
      setWordCount(countArticleWords(editor.getText()));
    };
    updateCount();

    const handleEditorUpdate = () => {
      updateCount();
      if (id) {
        triggerAutoSave();
      }
    };

    editor.on('update', handleEditorUpdate);

    return () => {
      editor.off('update', handleEditorUpdate);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editor, id, triggerAutoSave]);

  useEffect(() => {
    if (post?.data && isInitialLoadRef.current && editor) {
      isInitialLoadRef.current = false;
      const htmlContent = (post.data.htmlContent as string) || '';

      queueMicrotask(() => {
        if (!editor.isDestroyed) {
          editor.commands.setContent(htmlContent, { emitUpdate: false });
          setWordCount(countArticleWords(editor.getText()));
        }
      });
    }
  }, [editor, post]);

  function handleToggleTag(tagId: string) {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((item) => item !== tagId)
      : [...selectedTagIds, tagId];
    setSelectedTagIds(next);
    selectedTagIdsRef.current = next;
    triggerAutoSave(next);
  }

  async function handleCreateTag() {
    const name = newTagName.trim();
    if (!name || isCreatingTag) return;
    setIsCreatingTag(true);
    try {
      const res = await parseResponse(hono.api.tags.$post({ json: { name } }));
      await queryClient.invalidateQueries({ queryKey: ['tags'] });
      setNewTagName('');
      const next = [...selectedTagIdsRef.current, res.data.id];
      setSelectedTagIds(next);
      selectedTagIdsRef.current = next;
      triggerAutoSave(next);
      toastManager.add({ type: 'success', title: `已创建标签 #${res.data.name}` });
    } catch (error) {
      toastManager.add({
        type: 'error',
        title: error instanceof Error ? error.message : '创建标签失败',
      });
    } finally {
      setIsCreatingTag(false);
    }
  }

  async function handleGenerateSummary() {
    if (isGeneratingSummary) return;
    const content = editor.getText().trim();
    if (content.length < 20) {
      toastManager.add({ type: 'info', title: '正文内容至少需要 20 个字' });
      return;
    }
    setIsGeneratingSummary(true);
    try {
      const res = await parseResponse(
        hono.api.ai.summary.$post({
          json: {
            title: form.state.values.title,
            content,
          },
        }),
      );
      form.setFieldValue('summary', res.data.summary);
      triggerAutoSave();
      toastManager.add({ type: 'success', title: 'AI 摘要已生成' });
    } catch (error) {
      toastManager.add({
        type: 'error',
        title: error instanceof Error ? error.message : 'AI 摘要生成失败',
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  function handleExportMarkdown() {
    const title = form.state.values.title || 'untitled';
    const text = editor.getText();
    const content = `# ${title}\n\n${text}\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.state.values.slug || title}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const readingMinutes = useMemo(() => estimateReadingMinutes(wordCount), [wordCount]);

  if (id && isPending) {
    return <EditorSkeleton />;
  }

  const allTags = tagsRes?.data ?? [];

  return (
    <div className='flex h-full min-h-0 min-w-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain md:flex-row md:overflow-hidden'>
      <div className='editor-form min-h-0 w-full shrink-0 border-b border-(--tt-toolbar-border-color) md:order-2 md:w-xs md:overflow-y-auto md:overscroll-contain md:border-b-0 md:border-l'>
        <div className='bg-background p-4 md:sticky md:top-0'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <Fieldset>
              <div className='flex flex-col gap-5'>
                <form.Field name='banner'>
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel>封面图</FieldLabel>
                        <BannerUpload
                          value={field.state.value}
                          onChange={(value) => {
                            field.handleChange(value);
                            triggerAutoSave();
                          }}
                          onError={(error) => console.error('Banner upload error:', error)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <FieldError match>
                            {field.state.meta.errors.filter(Boolean).map(String).join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='title'>
                  {(field) => {
                    const inValid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field invalid={inValid}>
                        <FieldLabel>标题</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            placeholder='请输入文章标题'
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              triggerAutoSave();
                            }}
                          />
                        </InputGroup>
                        {field.state.meta.errors.length > 0 && (
                          <FieldError match>
                            {field.state.meta.errors.filter(Boolean).map(String).join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='slug'>
                  {(field) => {
                    const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field invalid={isValid}>
                        <FieldLabel>固定链接 (Slug)</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            placeholder='例如 my-first-post'
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              triggerAutoSave();
                            }}
                          />
                        </InputGroup>
                        {field.state.meta.errors.length > 0 && (
                          <FieldError match>
                            {field.state.meta.errors.filter(Boolean).map(String).join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <Field>
                  <FieldLabel>标签</FieldLabel>
                  {allTags.length > 0 ? (
                    <div className='flex w-full flex-wrap gap-1.5'>
                      {allTags.map((tag) => {
                        const selected = selectedTagIds.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type='button'
                            onClick={() => handleToggleTag(tag.id)}
                          >
                            <Badge variant={selected ? 'default' : 'outline'}>#{tag.name}</Badge>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className='text-xs text-muted-foreground'>暂无标签，可在下方新建</p>
                  )}
                  <InputGroup>
                    <InputGroupInput
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          void handleCreateTag();
                        }
                      }}
                      placeholder='新建标签...'
                    />
                    <InputGroupAddon align='inline-end'>
                      <Button
                        type='button'
                        size='icon-xs'
                        variant='ghost'
                        aria-label='新建标签'
                        loading={isCreatingTag}
                        onClick={handleCreateTag}
                      >
                        <PlusIcon className='size-3.5' />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                <form.Field name='description'>
                  {(field) => {
                    const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field invalid={isValid}>
                        <FieldLabel>简介</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            placeholder='显示在列表与 SEO 描述中的简短介绍'
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              triggerAutoSave();
                            }}
                          />
                        </InputGroup>
                        {field.state.meta.errors.length > 0 && (
                          <FieldError match>
                            {field.state.meta.errors.filter(Boolean).map(String).join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='summary'>
                  {(field) => {
                    const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field invalid={isValid}>
                        <FieldLabel>AI 摘要</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            placeholder='文章导读摘要，可点击下方按钮自动生成'
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              triggerAutoSave();
                            }}
                          />
                          <InputGroupAddon align='block-end'>
                            <div className='flex w-full justify-end'>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                loading={isGeneratingSummary}
                                onClick={handleGenerateSummary}
                                className='rounded-md'
                              >
                                <Sparkles className='size-4' /> AI 生成
                              </Button>
                            </div>
                          </InputGroupAddon>
                        </InputGroup>
                        {field.state.meta.errors.length > 0 && (
                          <FieldError match>
                            {field.state.meta.errors.filter(Boolean).map(String).join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='published'>
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel>发布状态</FieldLabel>
                        <Select
                          items={[
                            { value: 'false', label: '草稿' },
                            { value: 'true', label: '已发布' },
                          ]}
                          value={field.state.value ? 'true' : 'false'}
                          onValueChange={(value) => {
                            field.handleChange(value === 'true');
                            triggerAutoSave();
                          }}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectPopup>
                            <SelectItem value='false'>草稿</SelectItem>
                            <SelectItem value='true'>已发布</SelectItem>
                          </SelectPopup>
                        </Select>
                        {field.state.meta.errors.length > 0 && (
                          <FieldError match>
                            {field.state.meta.errors.filter(Boolean).map(String).join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </Fieldset>
          </form>
        </div>
      </div>
      <div className='relative flex min-h-0 min-w-0 shrink-0 flex-col md:order-1 md:flex-1 md:overflow-y-auto md:overscroll-contain'>
        <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-4 py-2 text-xs text-muted-foreground backdrop-blur-xs'>
          <div className='flex items-center gap-3'>
            <span className='tabular-nums'>
              约 {wordCount.toLocaleString()} 字 · {readingMinutes} 分钟阅读
            </span>
            {saveState === 'saving' ? (
              <span className='inline-flex items-center gap-1.5 text-foreground'>
                <Spinner className='size-3' />
                保存中...
              </span>
            ) : saveState === 'saved' && lastSavedAt ? (
              <span>已保存 · {dayjs(lastSavedAt).format('HH:mm')}</span>
            ) : saveState === 'error' ? (
              <span className='text-destructive'>保存失败</span>
            ) : null}
          </div>
          <div className='flex items-center gap-1'>
            <Button type='button' variant='ghost' size='xs' onClick={handleExportMarkdown}>
              <DownloadIcon className='size-3.5' />
              导出文本
            </Button>
            {id && form.state.values.published ? (
              <Button
                variant='ghost'
                size='xs'
                render={<a href={`/blog/${id}`} target='_blank' rel='noreferrer' />}
              >
                <ExternalLinkIcon className='size-3.5' />
                查看文章
              </Button>
            ) : null}
          </div>
        </div>
        <div className='min-h-0 flex-1'>
          <Editor editor={editor} />
        </div>
      </div>
    </div>
  );
}
