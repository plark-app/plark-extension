declare module '*.svg' {
    import { SFC, SVGProps } from 'react';

    const content: SFC<SVGProps>;
    export default content;
}
