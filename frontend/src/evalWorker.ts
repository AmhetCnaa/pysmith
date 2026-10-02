const EVAL_REGEX = /{{\s*(.*?)\s*}}/g;

self.onmessage = (e) => {
  const { widgets, dataTree } = e.data;
  const evaluatedTree = { ...dataTree };

  const evaluateString = (str: string, currentTree: any) => {
    if (typeof str !== 'string') return str;
    
    // Check if the string is exactly one {{ expression }}
    const exactMatch = str.trim().match(/^{{\s*(.*?)\s*}}$/);
    if (exactMatch) {
      const code = exactMatch[1];
      try {
        const fn = new Function('dataTree', `return ${code}`);
        return fn(currentTree);
      } catch (err) {
        return undefined;
      }
    }

    // Replace multiple interpolations within a string
    return str.replace(EVAL_REGEX, (match, code) => {
      try {
        const fn = new Function('dataTree', `return ${code}`);
        const result = fn(currentTree);
        return result !== undefined ? String(result) : '';
      } catch (err) {
        return 'undefined';
      }
    });
  };

  widgets.forEach((widget: any) => {
    const evaluatedProps: Record<string, any> = {};
    for (const [key, value] of Object.entries(widget.props)) {
      if (typeof value === 'string' && value.includes('{{')) {
        evaluatedProps[key] = evaluateString(value, dataTree);
      } else {
        evaluatedProps[key] = value;
      }
    }
    // Store evaluated props in a separate key so we don't overwrite raw strings
    evaluatedTree[`${widget.id}_EVAL`] = evaluatedProps;
  });

  self.postMessage({ evaluatedTree });
};
