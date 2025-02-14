import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { File, GripVertical, X } from 'lucide-react';

interface FileItemProps {
  id: string;
  name: string;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function FileItem({ id, name, active, onSelect, onDelete }: FileItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 px-4 py-2 text-sm transition-colors
        ${active ? 'bg-secondary text-secondary-foreground' : 'hover:bg-secondary/30'}`}
    >
      <button
        className="text-muted-foreground hover:text-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="relative">
        <File className="h-4 w-4" />
        {active && (
          <div className="absolute inset-0 bg-primary/10 rounded-full" />
        )}
      </div>

      <div className="flex-1 flex items-center justify-between min-w-0">
        <span className="truncate">{name}</span>
        <button
          className="text-muted-foreground hover:text-foreground transition-opacity"
          onClick={onDelete}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface FileListProps {
  files: string[];
  activeFile: string;
  onFileSelect: (file: string) => void;
  onFileDelete: (file: string) => void;
  onFilesReorder: (files: string[]) => void;
}

export function FileList({ files, activeFile, onFileSelect, onFileDelete, onFilesReorder }: FileListProps) {
  return (
    <aside className="w-72 border-r border-border bg-card/50">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Files</h2>
      </div>
      <div className="py-2">
        <SortableContext items={files} strategy={verticalListSortingStrategy}>
          {files.map((file) => (
            <FileItem
              key={file}
              id={file}
              name={file}
              active={file === activeFile}
              onSelect={() => onFileSelect(file)}
              onDelete={() => onFileDelete(file)}
            />
          ))}
        </SortableContext>
      </div>
    </aside>
  );
}
