import React from "react";

const AdminLayout = ({ title, subtitle, rightSection, children }) => {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {(title || subtitle || rightSection) && (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-2">
          <div>
            {title && (
              <h1 className="text-2xl font-heading font-bold text-foreground">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          {rightSection && (
            <div className="flex items-center gap-3">{rightSection}</div>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default AdminLayout;