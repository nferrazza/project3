export function getFromStorage(key) {
    console.log('importedGet');
    if (!key) {
        return null;
    }
    
    try {
        const valueStr = localStorage.getItem(key);
        if (valueStr)   {
          return JSON.parse(valueStr);
        }
        return null;
      } catch (err) {
        return null;
      }
    }

