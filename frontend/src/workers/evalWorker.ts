self.onmessage = (e) => {
  const { unparsedTree } = e.data;
  const evaluatedTree: Record<string, any> = { ...unparsedTree };
  
  const regex = /{{\s*(.*?)\s*}}/g;

  // Context for evaluation
  const dataTreeContext = { ...unparsedTree };

  for (const [entityName, entityProps] of Object.entries(unparsedTree)) {
    evaluatedTree[entityName] = { ...entityProps as object };
    
    for (const [propKey, propValue] of Object.entries(entityProps as object)) {
      if (typeof propValue === 'string' && propValue.includes('{{')) {
        try {
          // Check if it's a single exact binding
          const exactMatch = /^{{\s*(.*?)\s*}}$/.exec(propValue);
          if (exactMatch) {
             const code = exactMatch[1];
             const fn = new Function('dataTree', `try { return ${code}; } catch(e) { return undefined; }`);
             evaluatedTree[entityName][propKey] = fn(dataTreeContext);
          } else {
             evaluatedTree[entityName][propKey] = propValue.replace(regex, (fullMatch, code) => {
               const fn = new Function('dataTree', `try { return ${code}; } catch(e) { return undefined; }`);
               const res = fn(dataTreeContext);
               return res !== undefined ? String(res) : 'undefined';
             });
          }
        } catch (err) {
          evaluatedTree[entityName][propKey] = undefined;
        }
      }
    }
  }

  self.postMessage(evaluatedTree);
};
