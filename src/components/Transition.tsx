import React, { useContext, useEffect, useRef } from 'react';
import { CSSTransition as ReactCSSTransition } from 'react-transition-group';

// Originally from https://gist.github.com/adamwathan/3b9f3ad1a285a2d1b482769aeb862467#gistcomment-3359963

interface Props {
  show?: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  appear?: boolean;
}

const Transition: React.FC<Props> = ({ show, appear, ...otherProps }) => {
  const { parent } = useContext(TransitionContext);
  const isInitialRender = useIsInitialRender();
  const isChild = show === undefined;

  if (isChild) {
    return (
      <CSSTransition
        appear={parent ? parent.appear || !parent.isInitialRender : false}
        show={parent?.show ? parent.show : false}
        {...otherProps}
      />
    );
  }

  return (
    <TransitionContext.Provider
      value={{
        parent: {
          show: Boolean(show),
          isInitialRender,
          appear,
        },
      }}
    >
      <CSSTransition appear={appear} show={show} {...otherProps} />
    </TransitionContext.Provider>
  );
};

export default Transition;

//
// Utils
//

type TransitionContextProps = {
  parent: {
    show: boolean;
    isInitialRender: boolean;
    appear?: boolean;
  };
};

const TransitionContext = React.createContext<Partial<TransitionContextProps>>({
  parent: {
    show: false,
    isInitialRender: true,
  },
});

const useIsInitialRender = () => {
  const isInitialRender = useRef(true);

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  return isInitialRender.current;
};

const CSSTransition: React.FC<Props> = ({
  show,
  enter = '',
  enterFrom = '',
  enterTo = '',
  leave = '',
  leaveFrom = '',
  leaveTo = '',
  appear,
  children,
}) => {
  const enterClasses = enter.split(' ').filter((s) => s.length);
  const enterFromClasses = enterFrom.split(' ').filter((s) => s.length);
  const enterToClasses = enterTo.split(' ').filter((s) => s.length);
  const leaveClasses = leave.split(' ').filter((s) => s.length);
  const leaveFromClasses = leaveFrom.split(' ').filter((s) => s.length);
  const leaveToClasses = leaveTo.split(' ').filter((s) => s.length);

  const addClasses = (node: HTMLElement, classes: string[]): void => {
    if (classes.length) {
      node.classList.add(...classes);
    }
  };

  const removeClasses = (node: HTMLElement, classes: string[]): void => {
    if (classes.length) {
      node.classList.remove(...classes);
    }
  };

  return (
    <ReactCSSTransition
      appear={appear}
      unmountOnExit
      in={show}
      timeout={(undefined as unknown) as any}
      addEndListener={(node: HTMLElement, done: () => void) => {
        node.addEventListener('transitionend', done, false);
      }}
      onEnter={(node: HTMLElement) => {
        addClasses(node, [...enterClasses, ...enterFromClasses]);
      }}
      onEntering={(node: HTMLElement) => {
        removeClasses(node, enterFromClasses);
        addClasses(node, enterToClasses);
      }}
      onEntered={(node: HTMLElement) => {
        removeClasses(node, [...enterToClasses, ...enterClasses]);
      }}
      onExit={(node: HTMLElement) => {
        addClasses(node, [...leaveClasses, ...leaveFromClasses]);
      }}
      onExiting={(node: HTMLElement) => {
        removeClasses(node, leaveFromClasses);
        addClasses(node, leaveToClasses);
      }}
      onExited={(node: HTMLElement) => {
        removeClasses(node, [...leaveToClasses, ...leaveClasses]);
      }}
    >
      {children}
    </ReactCSSTransition>
  );
};
