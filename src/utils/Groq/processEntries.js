import groqSerivce from "."

async function processEntries(parsedData, promptTemplate) {
  // Loop through each entry in parsedData.data
  for (let entry of parsedData.data) {
    let prompt = promptTemplate;

    // Replace placeholders in the prompt
    for (const [key, value] of Object.entries(entry)) {
      // Check if the key is "others" which is an array of JSON strings
      if (key === "others" && Array.isArray(value)) {
        // Parse each "other" JSON string and merge them into a single object
        const othersObj = value.reduce((acc, jsonStr) => {
          const parsed = JSON.parse(jsonStr);
          return { ...acc, ...parsed };
        }, {});
        
        // Replace placeholders for each field in "others"
        for (const [otherKey, otherValue] of Object.entries(othersObj)) {
          prompt = prompt.replace(new RegExp(`{{${otherKey}}}`, 'g'), otherValue);
        }
      } else {
        // Replace placeholder with value for each main entry key
        prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value || "");
      }
    }

    try {
      // Send the prompt to the API
      console.log(prompt);
      const response = await groqSerivce.getResponse(prompt);
      // Add the API response to the entry
      entry.response = response;
      console.log(response);
      
    } catch (error) {
      console.error(`Error processing entry for ${entry.name}:`, error);
      entry.response = { error: 'Failed to get response from API' };
    }
  }
  return parsedData;
}

export default processEntries;
