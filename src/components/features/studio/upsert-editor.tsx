import { useForm } from '@tanstack/react-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';
import { isNil } from 'lodash-es';
import { Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { BannerUpload } from '~/components/features/banner-upload';
import { Editor } from '~/components/features/editor';
import { EditorSkeleton } from '~/components/features/page-skeletons';
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
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from '~/components/ui/select';
import { Spinner } from '~/components/ui/spinner';
import { toastManager } from '~/components/ui/toast';
import { useDelayedPending } from '~/hooks/use-delayed-pending';
import { useEditor } from '~/hooks/use-editor';
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
  jsonContent?: any;
}

export function UpsertEditor(props: { id?: string }) {
  const { id } = props;
  const editor = useEditor();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  const { data: post, isPending } = useQuery({
    enabled: !isNil(id),
    queryKey: ['admin-post-detail', id],
    queryFn: () => getAdminPost({ data: id! }),
  });

  const showSkeleton = useDelayedPending(Boolean(id) && isPending);

  const form = useForm({
    defaultValues: {
      title: post?.data?.title ?? '',
      description: post?.data?.description ?? '',
      slug: post?.data?.slug ?? '',
      banner:
        post?.data?.banner ??
        'https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      summary: post?.data?.summary ?? '',
      published: post?.data?.published ?? false,
    },
    async onSubmit({ value }) {
      const htmlContent = editor.getHTML();
      const jsonContent = editor.getJSON();
      const submitData = {
        ...value,
        htmlContent,
        jsonContent,
      };
      if (id) {
        return handleUpdate(submitData);
      } else {
        return handleCreate(submitData);
      }
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
        queryClient.invalidateQueries({ queryKey: ['admin-post-detail', id] });
      }
    } catch (err) {
      toastManager.add({ type: 'error', title: '文章更新失败' });
      throw err;
    }
  }

  // 自动保存函数
  const autoSave = useCallback(async () => {
    if (!id) return; // 只有更新时才自动保存，新建时不自动保存

    const formValues = form.state.values;
    const htmlContent = editor.getHTML();
    const jsonContent = editor.getJSON();

    try {
      setIsSaving(true);
      await parseResponse(
        hono.api.posts.$put({
          json: {
            ...formValues,
            htmlContent,
            jsonContent,
            id,
          },
        }),
      );
      // 不刷新数据，避免覆盖用户正在编辑的内容
    } catch (err) {
      console.error('自动保存失败:', err);
      toastManager.add({ type: 'error', title: '自动保存失败' });
    } finally {
      setIsSaving(false);
    }
  }, [id, editor, form.state.values]);

  // 防抖的自动保存触发
  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      void autoSave();
    }, 2000);
  }, [autoSave]);

  // Ctrl+S 快捷键保存
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

  // 监听编辑器内容变化
  useEffect(() => {
    if (!editor || !id) return;

    const handleEditorUpdate = () => {
      triggerAutoSave();
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
      const htmlContent = post.data.htmlContent as string;

      queueMicrotask(() => {
        if (!editor.isDestroyed) {
          editor.commands.setContent(htmlContent, { emitUpdate: false });
        }
      });
    }
  }, [editor, post]);

  if ((id && isPending) || showSkeleton) {
    return showSkeleton ? <EditorSkeleton /> : null;
  }

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
              <div className='flex flex-col gap-6'>
                <form.Field name='banner'>
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel>Banner</FieldLabel>
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
                        <FieldLabel>Title</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            placeholder='请输入标题'
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
                        <FieldLabel>Slug</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            placeholder='请输入slug'
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
                <form.Field name='description'>
                  {(field) => {
                    const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field invalid={isValid}>
                        <FieldLabel>Description</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            placeholder='请输入Description'
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
                        <FieldLabel>Summary</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            placeholder='请输入Summary'
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              triggerAutoSave();
                            }}
                          />
                          <InputGroupAddon align='block-end'>
                            <div className='flex w-full justify-end'>
                              <Button variant='ghost' size='sm' className='rounded-md'>
                                <Sparkles className='size-4' /> AI Generate
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
                        <FieldLabel>Published</FieldLabel>
                        <Select
                          items={[
                            { value: 'false', label: 'Draft' },
                            { value: 'true', label: 'Published' },
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
                            <SelectItem value='false'>Draft</SelectItem>
                            <SelectItem value='true'>Published</SelectItem>
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
      <div className='relative min-h-0 min-w-0 shrink-0 md:order-1 md:flex-1 md:overflow-y-auto md:overscroll-contain'>
        {isSaving && (
          <div className='fixed top-30 right-0 left-0 z-10 mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur-sm'>
            <Spinner className='size-3' />
            <span>Saving...</span>
          </div>
        )}
        <Editor editor={editor} />
      </div>
    </div>
  );
}
