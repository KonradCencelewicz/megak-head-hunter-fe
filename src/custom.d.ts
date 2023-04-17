declare module "*.svg" {
    import React from 'react';
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const value: any;
    export = value;
}

declare module "*.webp" {
    const value: any;
    export = value;
}