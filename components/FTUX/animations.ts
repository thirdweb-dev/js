export const titleAnimation = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
    },
  },
  exit: { opacity: 0, x: 20 },
};

export const textAnimation = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2,
    },
  },
  exit: { opacity: 0, x: 20 },
};

export const moveDown = {
  initial: {
    opacity: 0,
    y: -50,
    width: "100%",
    height: "100%",
  },
  animate: {
    opacity: 1,
    y: 0,
    width: "100%",
    height: "100%",
  },
  exit: {
    opacity: 0,
    y: -50,
    width: "100%",
    height: "100%",
  },
};

export const moveUp = {
  initial: { opacity: 0, y: "100%" },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100%" },
};
