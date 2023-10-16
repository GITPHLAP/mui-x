import * as React from 'react';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridVirtualScroller } from '../../hooks/features/virtualization/useGridVirtualScroller';
import { GridOverlays } from '../base/GridOverlays';
import { GridHeaders } from '../GridHeaders';
import { GridVirtualScrollerContainer } from './GridVirtualScrollerContainer';
import { GridVirtualScrollerContent } from './GridVirtualScrollerContent';
import { GridVirtualScrollerRenderZone } from './GridVirtualScrollerRenderZone';
import { GridTopContainer } from './GridTopContainer';
import { GridBottomContainer } from './GridBottomContainer';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['virtualScroller'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Element = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScroller',
  overridesResolver: (props, styles) => styles.virtualScroller,
})<{ ownerState: OwnerState }>({
  overflow: 'auto',
  height: '100%',
  // See https://github.com/mui/mui-x/issues/4360
  position: 'relative',
  '@media print': {
    overflow: 'hidden',
  },
});

const Scroller = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> }
>(function GridVirtualScroller(props, ref) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <Element
      ref={ref}
      {...props}
      className={clsx(classes.root, props.className)}
      ownerState={rootProps}
    />
  );
});

export interface GridVirtualScrollerProps extends React.HTMLAttributes<HTMLDivElement> {}

function GridVirtualScroller(props: GridVirtualScrollerProps) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();

  const virtualScroller = useGridVirtualScroller({});
  const {
    getContainerProps,
    getScrollerProps,
    getContentProps,
    getRenderZoneProps,
  } = virtualScroller;

  return (
    <GridVirtualScrollerContainer {...getContainerProps()}>
      <Scroller className={className} {...getScrollerProps(other)}>
        <GridTopContainer>
          <GridHeaders />
          <GridOverlays />
          <rootProps.slots.pinnedRows virtualScroller={virtualScroller} position="top" />
        </GridTopContainer>

        <GridVirtualScrollerContent {...getContentProps()}>
          <GridVirtualScrollerRenderZone {...getRenderZoneProps()}>
            <rootProps.slots.mainRows virtualScroller={virtualScroller} />
          </GridVirtualScrollerRenderZone>
        </GridVirtualScrollerContent>

        <GridBottomContainer>
          <rootProps.slots.pinnedRows virtualScroller={virtualScroller} position="bottom" />
        </GridBottomContainer>
      </Scroller>
    </GridVirtualScrollerContainer>
  );
}

export { GridVirtualScroller };
