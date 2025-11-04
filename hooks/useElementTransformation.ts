// This hook has been deprecated and its logic has been moved into the Canvas.tsx component
// to provide a more integrated and performant user experience for element transformations.
// This file is kept to prevent import errors but should not be used.
const useElementTransformation = () => {
    // Deprecated: Do not use.
    return { handleMouseDown: () => {} };
};

export default useElementTransformation;