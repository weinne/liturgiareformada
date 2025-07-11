import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ExpandableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  className?: string;
  minHeight?: string;
}

const ExpandableTextarea: React.FC<ExpandableTextareaProps> = ({
  value,
  onChange,
  placeholder,
  label,
  className,
  minHeight = "40px"
}) => {
  const [isExpanded, setIsExpanded] = useState(!!value);

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleBlur = () => {
    if (!value.trim()) {
      setIsExpanded(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div
        className={cn(
          "border border-input rounded-md transition-all duration-200 cursor-text",
          isExpanded ? "bg-background" : "bg-muted/20 hover:bg-muted/40",
          className
        )}
        onClick={handleClick}
        style={{ minHeight: isExpanded ? "100px" : minHeight }}
      >
        {isExpanded ? (
          <Textarea
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            style={{ minHeight: "100px" }}
            autoFocus
          />
        ) : (
          <div className="p-3 text-sm text-muted-foreground">
            {value || placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandableTextarea;