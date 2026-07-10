"use client";

type RemoveDuplicatesOptionProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
};

function RemoveDuplicatesOption({
  checked,
  onCheckedChange,
  id,
}: RemoveDuplicatesOptionProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="h-4 w-4 rounded border-border"
      />
      Quitar duplicados
    </label>
  );
}

export { RemoveDuplicatesOption };
