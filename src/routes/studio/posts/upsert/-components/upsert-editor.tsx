import { useForm } from '@tanstack/react-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { parseResponse } from 'hono/client';
import { isNil } from 'lodash-es';
import { Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

import { BannerUpload } from '~/components/features/banner-upload';
import { Editor } from '~/components/features/editor';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '~/components/tiptap/ui-primitive/toolbar';
import { Button } from '~/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '~/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from '~/components/ui/input-group';
import { NativeSelect, NativeSelectOption } from '~/components/ui/native-select';
import { Skeleton } from '~/components/ui/skeleton';
import { Spinner } from '~/components/ui/spinner';
import { useEditor } from '~/hooks/use-editor';
import { hono } from '~/lib/hono';

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

function ToolbarSkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={`h-8 min-w-8 rounded-xl ${className ?? ''}`.trim()} />;
}

function UpsertEditorSkeleton() {
  return (
    <div className='flex h-[calc(100vh-82px)] flex-col overflow-hidden md:flex-row'>
      <div className='editor-form w-full overflow-y-auto border-b border-(--tt-toolbar-border-color) md:order-2 md:w-xs md:border-b-0 md:border-l'>
        <div className='bg-[--tt-background-color] p-2 md:sticky md:top-0'>
          <div className='flex flex-col gap-7'>
            <div className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-12 rounded-md' />
              <div className='relative overflow-hidden rounded-md border border-input/60'>
                <Skeleton className='h-48 w-full rounded-none' />
                <Skeleton className='absolute top-2 right-2 size-7 rounded-full' />
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-12 rounded-md' />
              <Skeleton className='h-10 w-full rounded-4xl' />
            </div>

            <div className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-12 rounded-md' />
              <Skeleton className='h-10 w-full rounded-4xl' />
            </div>

            <div className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-24 rounded-md' />
              <Skeleton className='h-24 w-full rounded-3xl' />
            </div>

            <div className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-16 rounded-md' />
              <div className='overflow-hidden rounded-3xl border border-input/60 bg-input/30'>
                <div className='flex flex-col gap-3 p-3 pb-2'>
                  <Skeleton className='h-4 w-2/3 rounded-md' />
                  <Skeleton className='h-4 w-full rounded-md' />
                  <Skeleton className='h-4 w-5/6 rounded-md' />
                </div>
                <div className='flex justify-end px-3 pb-3'>
                  <Skeleton className='h-8 w-28 rounded-full' />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-20 rounded-md' />
              <Skeleton className='h-9 w-full rounded-4xl' />
            </div>
          </div>
        </div>
      </div>

      <div className='relative flex-1 overflow-y-auto md:order-1'>
        <div className='editor relative'>
          <Toolbar>
            <div className='flex-1' />

            <ToolbarGroup>
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <ToolbarSkeletonButton className='w-24' />
              <ToolbarSkeletonButton className='w-28' />
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton />
              <ToolbarSkeletonButton className='w-14' />
            </ToolbarGroup>

            <div className='flex-1' />
          </Toolbar>

          <div className='mx-auto flex h-full w-full max-w-[648px] flex-col px-6 py-12 pb-[30vh] md:px-12'>
            <div className='flex flex-1 flex-col gap-4'>
              <Skeleton className='h-11 w-3/4 rounded-2xl' />
              <Skeleton className='h-5 w-full rounded-lg' />
              <Skeleton className='h-5 w-11/12 rounded-lg' />
              <Skeleton className='h-5 w-10/12 rounded-lg' />
              <div className='h-3' />
              <Skeleton className='h-32 w-full rounded-3xl' />
              <div className='h-2' />
              <Skeleton className='h-5 w-full rounded-lg' />
              <Skeleton className='h-5 w-full rounded-lg' />
              <Skeleton className='h-5 w-9/12 rounded-lg' />
              <div className='h-3' />
              <Skeleton className='h-8 w-40 rounded-xl' />
              <Skeleton className='h-5 w-full rounded-lg' />
              <Skeleton className='h-5 w-10/12 rounded-lg' />
              <Skeleton className='h-5 w-full rounded-lg' />
              <Skeleton className='h-5 w-8/12 rounded-lg' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpsertEditor(props: { id?: string }) {
  const { id } = props;
  const editor = useEditor();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  const { data: post, isPending } = useQuery({
    enabled: !isNil(id),
    queryKey: ['post-detail', id],
    queryFn() {
      return parseResponse(
        hono.api.posts[':id'].$get({
          param: { id: id as string },
        }),
      );
    },
  });

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
        toast.success('文章创建成功');

        navigate({ to: '/studio/posts/upsert/$id', params: { id: resp.data.id } });
      }
    } catch (err) {
      toast.error('文章创建失败');
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
        toast.success('文章更新成功');
        queryClient.invalidateQueries({ queryKey: ['post-detail', id] });
      }
    } catch (err) {
      toast.error('文章更新失败');
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
      toast.error('自动保存失败');
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
      editor.commands.setContent(post.data.htmlContent as string);
      isInitialLoadRef.current = false;
    }
  }, [editor, post]);

  if (id && isPending) {
    return <UpsertEditorSkeleton />;
  }

  return (
    <div className='flex h-[calc(100vh-82px)] flex-col overflow-hidden md:flex-row'>
      <div className='editor-form w-full overflow-y-auto border-b border-(--tt-toolbar-border-color) md:order-2 md:w-xs md:border-b-0 md:border-l'>
        <div className='bg-[--tt-background-color] p-2 md:sticky md:top-0'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <FieldSet>
              <FieldGroup>
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
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='title'>
                  {(field) => {
                    const inValid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={inValid}>
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
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='slug'>
                  {(field) => {
                    const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isValid}>
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
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='description'>
                  {(field) => {
                    const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isValid}>
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
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='summary'>
                  {(field) => {
                    const isValid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isValid}>
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
                              <Button variant='ghost' size='sm' className='rounded-full'>
                                <Sparkles className='size-4' /> AI Generate
                              </Button>
                            </div>
                          </InputGroupAddon>
                        </InputGroup>
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name='published'>
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel>Published</FieldLabel>
                        <NativeSelect
                          value={field.state.value ? 'true' : 'false'}
                          onChange={(event) => {
                            field.handleChange(event.target.value === 'true');
                            triggerAutoSave();
                          }}
                        >
                          <NativeSelectOption value='false'>Draft</NativeSelectOption>
                          <NativeSelectOption value='true'>Published</NativeSelectOption>
                        </NativeSelect>
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      </div>
      <div className='relative flex-1 overflow-y-auto md:order-1'>
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
