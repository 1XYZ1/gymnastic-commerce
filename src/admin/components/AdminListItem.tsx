import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface AdminListItemProps {
  onClick: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  metadata?: {
    label: string;
    value: string | React.ReactNode;
  }[];
  actions?: React.ReactNode;
  className?: string;
}

/**
 * AdminListItem - Mobile-optimized list item component for admin panels
 *
 * Designed for mobile views (< md breakpoint) with:
 * - Full clickable area for navigation
 * - Clear touch targets (min 44px height)
 * - Hover and active states for feedback
 * - Support for badges, metadata, and actions
 * - WCAG 2.1 AA compliant
 *
 * For desktop views, use the traditional shadcn/ui Table component instead.
 *
 * @example
 * <AdminListItem
 *   onClick={() => navigate(`/admin/products/${id}`)}
 *   title="Product Name"
 *   subtitle="SKU-12345"
 *   badge={<Badge variant="secondary">Active</Badge>}
 *   metadata={[
 *     { label: "Price", value: "$99.99" },
 *     { label: "Stock", value: "45" }
 *   ]}
 *   actions={
 *     <Button size="sm" variant="ghost">
 *       <MoreVertical className="h-4 w-4" />
 *     </Button>
 *   }
 * />
 */
export function AdminListItem({
  onClick,
  title,
  subtitle,
  badge,
  metadata,
  actions,
  className,
}: AdminListItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as HTMLElement).closest('[data-admin-list-action]')) {
      e.stopPropagation();
      return;
    }
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Support keyboard navigation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        // Base styling
        "relative cursor-pointer transition-all duration-200",
        // Spacing and structure
        "p-4 gap-3",
        // Interactive states
        "hover:bg-accent hover:shadow-md",
        "active:scale-[0.98] active:shadow-sm",
        // Focus state for accessibility
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Touch target optimization
        "min-h-[44px]",
        className
      )}
      aria-label={`View details for ${title}`}
    >
      {/* Header: Title and Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1">
          {/* Title */}
          <h3 className="font-semibold text-base leading-tight truncate">
            {title}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Badge */}
        {badge && (
          <div className="flex-shrink-0 pt-0.5">
            {badge}
          </div>
        )}
      </div>

      {/* Metadata Grid */}
      {metadata && metadata.length > 0 && (
        <div
          className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t"
          role="list"
          aria-label="Item metadata"
        >
          {metadata.map((item, index) => (
            <div
              key={index}
              className="space-y-0.5"
              role="listitem"
            >
              <dt className="text-xs text-muted-foreground font-medium">
                {item.label}
              </dt>
              <dd className="text-sm font-medium truncate">
                {item.value}
              </dd>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {actions && (
        <div
          data-admin-list-action
          className="flex items-center justify-end gap-2 pt-2 border-t"
          onClick={(e) => e.stopPropagation()}
          role="group"
          aria-label="Item actions"
        >
          {actions}
        </div>
      )}
    </Card>
  );
}
