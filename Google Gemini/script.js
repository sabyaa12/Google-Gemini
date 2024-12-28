const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion-list .suggestion");
const toggleThemeButton = document.querySelector("#toggle-theme-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

let userMessage = null;
let isResponseGenerating = false;

// API configuration (ensure the API key is valid and correct)
const API_KEY = "AIzaSyAdPYk3vGiw24MrBBoygRaEBI1O8XvHvng"; // Update with a valid API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const loadLocalStorageData = () => {
    const savedChats = localStorage.getItem("savedChats");
    const isLightMode = (localStorage.getItem("themecolor") === "light_mode");

    document.body.classList.toggle("light_mode", isLightMode);
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

    chatList.innerHTML = savedChats || "";
    document.body.classList.toggle("hide-header", !!savedChats);
    chatList.scrollTo(0, chatList.scrollHeight);
};
loadLocalStorageData();

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Typing effect simulation
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
    const words = text.split(' ');
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
            isResponseGenerating = false;
            localStorage.setItem("savedChats", chatList.innerHTML);
        }
        chatList.scrollTo(0, chatList.scrollHeight);
    }, 75);
};

// API response handler
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text");
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents : [{
                    role: "user" ,
                    parts: [{text: userMessage}]
                }]
            })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        const apiResponse = data?.candidates[0]?.text || "No response received";
        showTypingEffect(apiResponse, textElement, incomingMessageDiv);
    } catch (error) {
        isResponseGenerating = false;
        textElement.innerText = `Error: ${error.message}`;
        textElement.classList.add("error");
    } finally {
        incomingMessageDiv.classList.remove("loading");
    }
};

// Submit handler
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isResponseGenerating) return;

    userMessage = typingForm.querySelector(".typing-input").value.trim();
    if (!userMessage) return;

    const outgoingMessageDiv = createMessageElement(
        `<div class="message-content">
            <img src="Image.jpg" alt="User Image" class="avatar">
            <p class="text">${userMessage}</p>
        </div>`,
        "outgoing"
    );
    chatList.append(outgoingMessageDiv);

    typingForm.querySelector(".typing-input").value = "";
    chatList.scrollTo(0, chatList.scrollHeight);

    const incomingMessageDiv = createMessageElement(
        `<div class="message-content">
            <img src="gemini.svg" alt="Gemini Image" class="avatar">
            <p class="text"></p>
            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        </div>`,
        "incoming", "loading"
    );
    chatList.append(incomingMessageDiv);

    isResponseGenerating = true;
    generateAPIResponse(incomingMessageDiv);
});

// Theme toggle button
toggleThemeButton.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light_mode");
    localStorage.setItem("themecolor", isLightMode ? "light_mode" : "dark_mode");
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

// Clear chat button
deleteChatButton.addEventListener("click", () => {
    localStorage.removeItem("savedChats");
    chatList.innerHTML = "";
    document.body.classList.remove("hide-header");
});










// const typingForm = document.querySelector(".typing-form");
// const chatList = document.querySelector(".chat-list");
// const suggestions = document.querySelectorAll(".suggestion-list .suggestion");
// const toggleThemeButton = document.querySelector("#toggle-theme-button"); // Removed extra space
// const DeletChatbutton = document.querySelector("#delete-chat-button"); // Removed extra space

// let userMessage = null;
// let isResponseGenerating = false;

// // API configuration
// const API_KEY = "AIzaSyC1AE_i0pjP0UhKTyLbQcTllD4cwPkTwsg";
// const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// const loadLocalstorageData = () => {
//     const savedChats = localStorage.getItem("savedChats");
//     const isLightMode = (localStorage.getItem("themecolor") === "light_mode"); // Removed extra space

//     // Apply the stored theme
//     document.body.classList.toggle("light_mode", isLightMode); // Corrected typo from "ligh_mode"
//     toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode"; // Removed extra space

//     // Restore the saved chats
//     chatList.innerHTML = savedChats || "";
//     document.body.classList.toggle("hide-header", !!savedChats);
//     chatList.scrollTo(0, chatList.scrollHeight); // Save to the bottoms
// }
// loadLocalstorageData();

// // Create a new message element and return it
// const createMessageElement = (content, ...classes) => {
//     const div = document.createElement("div");
//     div.classList.add("message", ...classes);
//     div.innerHTML = content;
//     return div;
// }
// const showTypingEffect = (text, textElement, incomingMessageDiv) => { // Added incomingMessageDiv as a parameter
//     const words = text.split(' ');
//     let currentWordIndex = 0;

//     const typingInterval = setInterval(() => {
//         textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
//         incomingMessageDiv.querySelector(".icon").classList.add("hide"); // Correctly uses the incomingMessageDiv parameter
//         if (currentWordIndex === words.length) {
//             clearInterval(typingInterval);
//             isResponseGenerating = false;

//             incomingMessageDiv.querySelector(".icon").classList.remove("hide");
        
//             localStorage.setItem("savedChats", chatList.innerHTML); // Save chats to local storage
//         }
//         chatList.scrollTo(0, chatList.scrollHeight); // Save to the bottoms

//     }, 75)
// }

// const generateAPIresponse = async (incomingMessageDiv) => {
//     const textElement = incomingMessageDiv.querySelector(".text"); // get text element
//     try {
//         const response = await fetch(API_URL, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" }, // Corrected extra space in "Content-Type"
//             body: JSON.stringify({
//                 contents: [{
//                     role: "user",
//                     parts: [{ text: userMessage }]
//                 }]
//             })
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error.message);
//         // get the API response text and remove asterisks from it 
//         const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
//         showTypingEffect(apiResponse, textElement, incomingMessageDiv); // Pass incomingMessageDiv as a parameter
//     } catch (error) {
//         isResponseGenerating = false;
//         textElement.innerText = error.message;
//         textElement.classList.add("error");
//     } finally {
//         incomingMessageDiv.classList.remove("loading");
//     }
// }


// // const showTypingEffect = (text, textElement) => {
// //     const words = text.split(' ');
// //     let currentWordIndex = 0;

// //     const typingInterval = setInterval(() => {
// //         textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
// //         incomingMessageDiv.querySelector(".icon").classList.add("hide");
// //         if (currentWordIndex === words.length) {
// //             clearInterval(typingInterval);
// //             isResponseGenerating = false;

// //             incomingMessageDiv.querySelector(".icon").classList.remove("hide");

// //             localStorage.setItem("savedChats", chatList.innerHTML); // Save chats to local storage
// //         }
// //         chatList.scrollTo(0, chatList.scrollHeight); // Save to the bottoms

// //     }, 75)
// // }

// // const generateAPIresponse = async (incomingMessageDiv) => {
// //     const textElement = incomingMessageDiv.querySelector(".text"); // Get text element
// //     try {
// //         const response = await fetch(API_URL, {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" }, // Corrected extra space in "Content-Type"
// //             body: JSON.stringify({
// //                 contents: [{
// //                     role: "user",
// //                     parts: [{ text: userMessage }]
// //                 }]
// //             })
// //         });
// //         const data = await response.json();
// //         if (!response.ok) throw new Error(data.error.message);
// //         // Get the API response text and remove asterisks from it
// //         const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
// //         // textElement.innerText = apiResponse;
// //         showTypingEffect(apiResponse, textElement);
// //     } catch (error) {
// //         isResponseGenerating = false;
// //         // console.log(error);
// //         textElement.innerText = error.message;
// //         textElement.classList.add("error");
// //     } finally {
// //         incomingMessageDiv.classList.remove("loading");
// //     }
// // }

// // Showing a loading animation while waiting for the API response
// const showloadingAnimation = () => {
//     const html = `<div class="message-content">
//                 <img src="gemini.svg" alt="Gemini Image" class="avatar">
//                 <p class="text"></p>
//                 <div class="loading-indicator">
//                     <div class="loading-bar"></div>
//                     <div class="loading-bar"></div>
//                     <div class="loading-bar"></div>
//                 </div>
//             </div>
//                 <span onclick="copyMessage(this)" class="icon material-symbols-outlined">content_copy</span>`;
//     const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
//     chatList.appendChild(incomingMessageDiv);
//     chatList.scrollTo(0, chatList.scrollHeight); // Save to the bottoms

//     generateAPIresponse(incomingMessageDiv);
// }

// const copyMessage = (copyIcon) => {
//     const messageText = copyIcon.parentElement.querySelector(".text").innerText; // Corrected typo from parentELement

//     navigator.clipboard.writeText(messageText);
//     copyIcon.innerText = "done"; // Show tick icon
//     setTimeout(() => copyIcon.innerText = "content_copy", 1000);
// }

// // Handle sending outgoing chat messages
// const handleOutgoingChat = () => {
//     userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
//     if (!userMessage || isResponseGenerating) return;
//     isResponseGenerating = true;
//     // Exit if there is no message
//     console.log(userMessage);

//     const html = `<div class="message-content">
//                 <img src="Image.jpg" alt="User Image" class="avatar">
//                 <p class="text"></p>
//             </div>`;
//     const outgoingMessageDiv = createMessageElement(html, "outgoing");
//     outgoingMessageDiv.querySelector(".text").innerText = userMessage; // Creating an element of outgoing message and adding it to the chat list
//     chatList.appendChild(outgoingMessageDiv);

//     typingForm.reset();
//     chatList.scrollTo(0, chatList.scrollHeight); // Save to the bottoms
//     document.body.classList.add("hide-header"); // Hide the header once chat starts
//     setTimeout(showloadingAnimation, 500); // Show loading animation after a delay
// }

// suggestions.forEach(suggestion => {
//     suggestion.addEventListener("click", () => {
//         userMessage = suggestion.querySelector(".text").innerText;
//         handleOutgoingChat();
//     })
// })

// toggleThemeButton.addEventListener("click", () => {
//     const isLightMode = document.body.classList.toggle("light_mode");
//     localStorage.setItem("themecolor", isLightMode ? "light_mode" : "dark_mode"); // Removed extra space
//     toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode"; // Removed extra space
// });

// DeletChatbutton.addEventListener("click", () => {
//     if (confirm("Are you sure you want to delete all messages")) {
//         localStorage.removeItem("savedChats");
//         loadLocalstorageData();
//     }
// })

// // Prevent default form submission and handle outgoing chat
// typingForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     handleOutgoingChat();
// });
