import groqSerivce from ".";
import conf from "../../conf/groqConf";


// const userData={
//     "name": "Sabick A",
//     "email": "sabicksabi@gmail.com",
//     "picture": "https://lh3.googleusercontent.com/a/ACg8ocJzkbcFJDqze1X-5Ur48vX13HfUp14lDPXHraHUhGYUWbO93xlY=s96-c",
//     "profession": "AI Engineer",
//     "organization": "Breakout AI",
//     "bio": "Our company excells in Ai technologies and creating full fledged applications",
//     "status": true,
//     "$id": "673dd08400104ff0925e",
//     "$createdAt": "2024-11-20T12:05:24.712+00:00",
//     "$updatedAt": "2024-11-22T08:57:51.881+00:00",
//     "$permissions": [],
//     "batches": [],
//     "$databaseId": "672dd98d002801065cc6",
//     "$collectionId": "6730455b003b722b11b2"
//   }

// const responseColumns=[
//     "name",
//     "companyName",
//     "location",
//     "products",
//     "department",
//     "phoneNumber"
//   ]


async function promptSuggester(userData,responseColumns) {
    try {
        const inputData = {
            userDetails: {
                name: userData.name,
                email: userData.email,
                profession: userData.profession,
                organization: userData.organization,
                bio: userData.bio,
            },
            recipientsDataPlaceholders: responseColumns
        };

        const prompt=JSON.stringify(inputData);
        const response=await groqSerivce.getResponse(conf.promptSystemMessage,prompt,true);

        return JSON.parse(response);
    } catch (error) {
        console.log("Prompt suggester Error: ", error);
        throw error;
    }
}




export default promptSuggester