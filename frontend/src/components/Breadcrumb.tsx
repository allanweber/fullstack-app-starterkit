import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { paths } from '@/lib/paths';
import { HomeIcon } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const breadcrumbItems = segments
    .reduce((acc: { id: string; path: string }[], segment: string) => {
      if (acc.length === 0) {
        return [
          {
            id: segment,
            path: segment,
          },
        ];
      }
      return [
        ...acc,
        {
          id: segment,
          path: `${acc[acc.length - 1].path}/${segment}`,
        },
      ];
    }, [])
    .map((segment) => {
      const path = paths.app[segment.id as keyof typeof paths.app];
      return {
        path: segment.path,
        description: path ? path.description : segment.id,
      };
    });

  return (
    <BreadcrumbComponent className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/${item.path}`} className="flex items-center gap-1">
                  {index === 0 && <HomeIcon className="w-4 h-4" />}
                  {item.description}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}
