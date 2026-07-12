import { Button, Flex } from 'antd';

interface FormActionsProps {
  loading?: boolean;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
}

export function FormActions({
  loading = false,
  onCancel,
  submitText = 'Lưu',
  cancelText = 'Hủy',
}: FormActionsProps) {
  return (
    <Flex gap={8} justify="flex-end" style={{ marginTop: 24 }}>
      {onCancel && (
        <Button onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
      )}
      <Button type="primary" htmlType="submit" loading={loading}>
        {submitText}
      </Button>
    </Flex>
  );
}
