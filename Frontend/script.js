const sections = ['welcome-section', 'survey_info', 'first_question', 'second_question', 'third_question', 'fourth_question', 'fifth_question', 'thank_you'];




let userName = "";
let userEmail = "";
window.onload = function () {

    google.accounts.id.initialize({
        client_id: "498744905277-g540jbs98127evm1pn72ira50vjqttlr.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        {
            theme: "outline",
            size: "large"
        }
    );
};
async function startSurvey(event) {

       if(event){

        event.preventDefault();

    }
    console.log("START BUTTON CLICKED");
    try {

        const token =
            localStorage.getItem("jwt");

        const res = await fetch(
            "http://localhost:10000/api/start-survey",
            {
                method: "POST",
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );
        console.log("STATUS:", res.status);
        const data =
            await res.json();
        console.log("DATA:", data);
        if (!data.success) {
            throw new Error();
        }

        showQuestion("first_question");

    } catch (error) {
        console.error(error);
        alert(
            "Authentication failed"
        );

    }

}
async function handleCredentialResponse(response) {

    console.log("GOOGLE CALLBACK FIRED");

    try {

        console.log("Sending request to backend...");

        const res = await fetch(
            "http://localhost:10000/api/start",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    googleToken: response.credential
                })
            }
        );

        console.log("Status:", res.status);

        const data = await res.json();
if (data.alreadySubmitted) {

    document.getElementById("userInfo")
        .innerHTML =
        "✓ Your response has already been submitted.";

    document.getElementById("startBtn")
        .disabled = true;

    return;
}
        console.log("BACKEND DATA:", data);

        if (!data.success) {
            throw new Error("Authentication failed");
        }

        // Save JWT from backend
        localStorage.setItem("jwt", data.token);

        // Decode Google payload for UI only
        const payload = JSON.parse(
            atob(response.credential.split('.')[1])
        );

        userName = payload.name;
        userEmail = payload.email;

        console.log("USERNAME:", userName);

        // Show signed-in user
        const userInfo =
            document.getElementById("userInfo");

        if (userInfo) {
            userInfo.innerHTML =
                `✓ Continuing as ${userName}`;
        }

        // Enable Start button
        document.getElementById("startBtn").disabled = false;

        console.log("Login Success");

    } catch (error) {

        console.error("FULL ERROR:", error);

        alert("Google verification failed");
    }
}





function hideAllSections() {

    sections.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.style.display = "none";
        }

    });

}

function showQuestion(questionId) {
    if (questionId === 'first_question') {
        // Proceed without email validation
    }

    if (questionId === 'second_question') {
        let answered = document.querySelector('input[name="frequency"]:checked');
        if (!answered) {
            alert('Please select an option before proceeding to the next question.');
            return;
        }
    }

    if (questionId === 'third_question') {
        let checkboxes = document.querySelectorAll('input[name="tools"]:checked');
        let textInput = document.querySelector('input[name="tools"][type="text"]');
        let textFilled = textInput && textInput.value.trim() !== '';
        let total = checkboxes.length + (textFilled ? 1 : 0);

        if (total < 2) {
            alert('Please select at least 2 options (or 1 option and fill the "Others" field) before proceeding.');
            return;
        }
    }

    if (questionId === 'fourth_question') {
        let checkboxes = document.querySelectorAll('input[name="activity"]:checked');
        if (checkboxes.length < 1) {
            alert('Please select at least one option before proceeding to the next question.');
            return;
        }
    }

    if (questionId === 'fifth_question') {
        let textarea = document.querySelector('textarea[name="automation"]');
        if (textarea.value.trim() === '') {
            alert('This question is compulsory. Please provide an answer before proceeding.');
            return;
        }
    }

    if (questionId === 'thank_you') {
        let textarea = document.querySelector('textarea[name="ideal_feature"]');
        if (textarea.value.trim() === '') {
            alert('This question is compulsory. Please provide an answer before submitting.');
            return;
        }
    }

    hideAllSections();
    document.getElementById(questionId).style.display = 'block';
}

async function submitSurvey() {

    const submitButton =
    document.querySelector(
        'button[onclick="submitSurvey()"]'
    );

submitButton.disabled = true;

    try {

        const token =
            localStorage.getItem("jwt");

        const q1 =
            document.querySelector(
                'input[name="frequency"]:checked'
            )?.value;

        const q2 = [];

        document
            .querySelectorAll(
                'input[name="tools"]:checked'
            )
            .forEach(
                item => q2.push(item.value)
            );

        const otherTool =
            document.querySelector(
                'input[name="tools"][type="text"]'
            ).value.trim();

        if (otherTool) {
            q2.push(otherTool);
        }

        const q3 = [];

        document
            .querySelectorAll(
                'input[name="activity"]:checked'
            )
            .forEach(
                item => q3.push(item.value)
            );

        const q4 =
            document.querySelector(
                'textarea[name="automation"]'
            ).value.trim();

        const q5 =
            document.querySelector(
                'textarea[name="ideal_feature"]'
            ).value.trim();

        const res = await fetch(
            "http://localhost:10000/api/survey",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                    "Authorization":
                        `Bearer ${token}`
                },
                body: JSON.stringify({
                    q1,
                    q2,
                    q3,
                    q4,
                    q5
                })
            }
        );

        const data =
            await res.json();

        console.log(data);

        if (data.success) {

            showQuestion(
                "thank_you"
            );

        }

    } catch(error) {
submitButton.disabled = false;
        console.error(error);

     alert(
    data.error || "Submission failed"
);

    }

}