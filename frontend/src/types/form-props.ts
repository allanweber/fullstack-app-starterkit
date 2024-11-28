export interface FormEvent<TBody> {
  onSave: (body: TBody) => void;
}

export interface FormProps<TBody> extends FormEvent<TBody> {
  record?: TBody;
}

export interface FormDialogProps<TBody> {
  open: boolean;
  setOpen: (open: boolean) => void;
  record?: TBody;
}
