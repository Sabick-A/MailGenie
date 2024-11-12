function extractKeys(arr) {
    const allKeys = new Set();
  
    arr.forEach(item => {
      Object.keys(item).forEach(key => {
        if (Array.isArray(item[key])) {
          item[key].forEach(subItem => {
            try {
              // Attempt to parse each stringified object in the array
              const parsed = JSON.parse(subItem);
              Object.keys(parsed).forEach(subKey => allKeys.add(subKey));
            } catch (e) {
              // If parsing fails, ignore (it might not be a JSON string)
            }
          });
        } else {
          allKeys.add(key);
        }
      });
    });
  
    return Array.from(allKeys);
  }

export default extractKeys;