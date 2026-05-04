interface SkeletonRowProps {
  cols: number;
}

export default function SkeletonRow({ cols }: SkeletonRowProps) {
  return (
    <tr className="border-b border-bg-border/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div
            className="h-4 skeleton rounded"
            style={{ width: `${60 + Math.random() * 40}%` }}
          />
        </td>
      ))}
    </tr>
  );
}
