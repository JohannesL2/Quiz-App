const apiUrl = "questions.json";
const rootContainer = document.getElementById("root");

let questionIndex = 0;
let score = 0;

//Timer
let timer;
let timeLeft = 10; //10 sekunder

function fetchQuestions() {
  const url = `${apiUrl}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      rootContainer.innerHTML = "";
      const titleElement = document.createElement("h1");
      titleElement.textContent = "Quiz App";
      titleElement.className = "display-3 p-2";
      rootContainer.appendChild(titleElement);

      //const messageElement = document.createElement("h2");
      //rootContainer.appendChild(messageElement);

      const dataQuestion = data[questionIndex];
      const questionElement = document.createElement("div");
      questionElement.classList.add("question");
      questionElement.textContent = dataQuestion.question;
      rootContainer.appendChild(questionElement);

      // lägg in alternativ för att svara på frågorna
      const optionsElement = document.createElement("div");
      optionsElement.classList.add("options");
      dataQuestion.options.forEach((option) => {
        const optionsLabel = document.createElement("label");
        optionsLabel.innerHTML = `
        
        <input type="radio" name="answer" value="${option}"/>${option}
        `;
        optionsElement.appendChild(optionsLabel);
        optionsElement.appendChild(document.createElement("br"));
      });
      rootContainer.appendChild(optionsElement);

      const nextQuestionBtn = document.createElement("button");
      nextQuestionBtn.className = "btn btn-light";
      // Ändrar så knappen ändras till submit när frågorna är slut
      nextQuestionBtn.textContent =
        questionIndex === data.length - 1 ? "Submit" : "Next question";
      rootContainer.appendChild(nextQuestionBtn);

      const radioButtons = document.querySelectorAll('input[name="answer"]');
      radioButtons.forEach((radioButton) => {
        radioButton.addEventListener("change", (event) => {
          const checkedOption = event.target;
          const correctAnswer = dataQuestion.answer;

          radioButtons.forEach((btn) => {
            btn.disabled = true;
          });

          if (!checkedOption) {
            alert("You have to choose an answer!");
          } else {
            questionIndex++;
          }

          if (checkedOption.value === correctAnswer) {
            score++;
            //alert("correct answer");
            checkedOption.parentElement.style.backgroundColor = "green";
          } else {
            //alert("Wrong answer");
            checkedOption.parentElement.style.backgroundColor = "red";
          }
        });
      });

      //timer animation

      const timerElement = document.createElement("h2");
      const progressContainer = document.createElement("div");
      const progressBar = document.createElement("div");

      rootContainer.appendChild(timerElement);
      rootContainer.appendChild(progressContainer);
      progressContainer.appendChild(progressBar);

      //progress bar styling
      progressContainer.style.width = "100%";
      progressContainer.style.height = "30px";
      progressContainer.style.borderRadius = "20px";
      progressBar.style.borderRadius = "20px";
      progressContainer.style.backgroundColor = "#ddd";
      progressContainer.style.marginTop = "10px";
      progressBar.style.backgroundColor = "grey";
      progressBar.style.margin = "0";
      progressBar.style.padding = "5px";
      progressBar.style.transition = "width 0.5s ease-in-out";

      timeLeft = 10;
      timerElement.textContent = timeLeft;

      if (timer) clearInterval(timer);

      timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        const progressBarWidth = (timeLeft / 10) * 100;
        progressBar.style.width = progressBarWidth + "%";

        if (timeLeft <= 0) {
          clearInterval(timer);
          questionIndex++;
          if (questionIndex < data.length) {
            fetchQuestions();
          } else {
            showResults();
          }
        }
      }, 1000);

      nextQuestionBtn.addEventListener("click", () => {
        if (questionIndex === data.length) {
          showResults();
          rootContainer.removeChild(timerElement);
        } else {
          fetchQuestions();
        }
      });
    });

  function showResults() {
    const playAgainBtn = document.createElement("button");
    playAgainBtn.className = "btn btn-light";
    playAgainBtn.textContent = `You got ${score} answers correct, do you want to try again?`;
    rootContainer.appendChild(playAgainBtn);

    playAgainBtn.addEventListener("click", () => {
      questionIndex = 0;
      score = 0;
      fetchQuestions();
    });
  }
}

fetchQuestions();
