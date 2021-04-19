import styledComponent, { css as cssProperty } from 'styled-components';
import 'twin.macro';

declare module 'twin.macro' {
  const css: typeof cssProperty;
  const styled: typeof styledComponent;
}
