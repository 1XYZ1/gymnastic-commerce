# AdminListItem Component

Mobile-optimized list item component for admin panels with responsive design and excellent UX.

## Features

- **Mobile-First Design**: Optimized for mobile views (< md breakpoint)
- **Full Clickable Area**: Entire card is clickable for navigation
- **Touch Targets**: Minimum 44px height for accessibility
- **Interactive States**: Hover, active, and focus states
- **Flexible Content**: Support for badges, metadata, and actions
- **WCAG 2.1 AA Compliant**: Full accessibility support
- **Keyboard Navigation**: Enter and Space key support

## Usage

### Basic Example

```tsx
import { AdminListItem } from "@/admin/components";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

function ProductsList() {
  const navigate = useNavigate();

  return (
    <AdminListItem
      onClick={() => navigate("/admin/products/123")}
      title="Nike Air Max 2024"
      subtitle="SKU-2024-001"
      badge={<Badge variant="secondary">Active</Badge>}
      metadata={[
        { label: "Price", value: "$149.99" },
        { label: "Stock", value: "45 units" },
      ]}
    />
  );
}
```

### With Actions

```tsx
import { AdminListItem } from "@/admin/components";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

function ProductsListWithActions() {
  const navigate = useNavigate();

  return (
    <AdminListItem
      onClick={() => navigate("/admin/products/123")}
      title="Adidas Ultraboost"
      subtitle="SKU-2024-002"
      badge={<Badge variant="destructive">Low Stock</Badge>}
      metadata={[
        { label: "Price", value: "$189.99" },
        { label: "Stock", value: "3 units" },
      ]}
      actions={
        <Button size="sm" variant="ghost">
          <MoreVertical className="h-4 w-4" />
        </Button>
      }
    />
  );
}
```

### Custom Metadata Rendering

```tsx
<AdminListItem
  onClick={() => navigate("/admin/products/999")}
  title="Custom Product"
  badge={<Badge variant="secondary">Featured</Badge>}
  metadata={[
    {
      label: "Price",
      value: <span className="text-green-600 font-bold">$99.99</span>
    },
    {
      label: "Status",
      value: <Badge variant="outline">In Stock</Badge>
    },
  ]}
/>
```

### Complete Page Implementation

```tsx
function ProductsListPage() {
  const navigate = useNavigate();
  const products = useProducts(); // Your data hook

  return (
    <div className="container mx-auto p-4">
      {/* Desktop: Table view */}
      <div className="hidden md:block">
        <Table>
          {/* Your table implementation */}
        </Table>
      </div>

      {/* Mobile: Card list view */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <AdminListItem
            key={product.id}
            onClick={() => navigate(`/admin/products/${product.id}`)}
            title={product.title}
            subtitle={product.sku}
            badge={
              <Badge variant={product.status === "Active" ? "secondary" : "destructive"}>
                {product.status}
              </Badge>
            }
            metadata={[
              { label: "Price", value: product.price },
              { label: "Stock", value: product.stock },
            ]}
            actions={
              <Button size="sm" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
          />
        ))}
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onClick` | `() => void` | Yes | Function called when card is clicked |
| `title` | `string` | Yes | Main title/heading |
| `subtitle` | `string` | No | Secondary text below title |
| `badge` | `React.ReactNode` | No | Badge component (e.g., status) |
| `metadata` | `{ label: string; value: string \| React.ReactNode }[]` | No | Array of metadata items displayed in 2-column grid |
| `actions` | `React.ReactNode` | No | Action buttons/icons (click events don't trigger navigation) |
| `className` | `string` | No | Additional CSS classes |

## Accessibility Features

- **Semantic HTML**: Uses proper heading hierarchy and ARIA roles
- **Keyboard Support**: Full Enter and Space key navigation
- **Focus Indicators**: Clear visible focus ring (2px ring with offset)
- **Screen Readers**: Descriptive aria-labels and roles
- **Touch Targets**: Minimum 44px height compliance
- **Color Contrast**: WCAG AA compliant contrast ratios

## Interaction Behavior

### Click Handling
- Clicking anywhere on the card triggers `onClick`
- Clicking on actions area (buttons) prevents navigation
- Uses `data-admin-list-action` attribute to identify action zone

### Keyboard Navigation
- **Tab**: Move focus to/from card
- **Enter/Space**: Trigger navigation
- **Tab** (on actions): Focus individual action buttons

### Visual Feedback
- **Hover**: Background changes to accent color, shadow increases
- **Active**: Slight scale down (0.98) for tactile feedback
- **Focus**: 2px ring with offset for clear visibility

## Design Decisions

### Mobile-First
This component is specifically designed for mobile views. On desktop (md breakpoint and above), use the traditional shadcn/ui Table component for better data density and scanning.

### Touch Target Size
All interactive elements meet the WCAG 2.1 AA minimum of 44x44px for touch accessibility.

### Metadata Grid
The 2-column grid layout provides optimal information density on mobile screens while maintaining readability.

### Action Isolation
Actions are isolated in a separate click zone to prevent accidental navigation when users intend to perform actions.

## Integration with Existing Admin Pages

To integrate with your existing admin pages:

1. Import the component:
```tsx
import { AdminListItem } from "@/admin/components";
```

2. Wrap your mobile view with responsive classes:
```tsx
<div className="md:hidden space-y-3">
  {/* AdminListItem components */}
</div>
```

3. Keep your existing table for desktop:
```tsx
<div className="hidden md:block">
  {/* Existing Table component */}
</div>
```

## Performance Considerations

- Component is lightweight with minimal dependencies
- Uses React best practices (event delegation, proper memo opportunities)
- Optimized for list rendering with proper key props
- Efficient CSS transitions for smooth interactions

## Browser Support

Works in all modern browsers with full feature support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
