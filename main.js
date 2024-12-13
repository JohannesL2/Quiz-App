const apiUrl = "questions.json"; //frågor och svar
const rootContainer = document.getElementById("root");

let questionIndex = 0;
let score = 0;

//Timer
let timer;
let timeLeft = 10; //10 sekunder

let nextQuestionBtn;
let progressContainer;
let progressBar;
let timerElement;

function fetchQuestions() {
  const url = `${apiUrl}`;

  fetch(url) //fetch från json
    .then((response) => response.json())
    .then((data) => {
      rootContainer.innerHTML = "";
      const titleElement = document.createElement("h1");
      titleElement.textContent = "💡Quiz App🧠";
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
      nextQuestionBtn.className = "btn btn-light w-100";
      // Ändrar så knappen ändras till submit när frågorna är slut
      nextQuestionBtn.textContent =
        questionIndex === data.length - 1
          ? "Submit" + "🏆"
          : "Next question" + "➡️";
      rootContainer.appendChild(nextQuestionBtn);
      nextQuestionBtn.disabled = true;

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
            nextQuestionBtn.disabled = false;
            progressBar.style.display = "none";
            progressContainer.style.display = "none";
            timerElement.style.display = "none";
            score++;
            //alert("correct answer");
            checkedOption.parentElement.style.backgroundColor = "#8bff85";
            checkedOption.parentElement.style.borderRadius = "10px";
            checkedOption.parentElement.innerHTML += "✔️";
          } else {
            nextQuestionBtn.disabled = false;
            progressBar.style.display = "none";
            progressContainer.style.display = "none";
            timerElement.style.display = "none";
            //alert("Wrong answer");
            checkedOption.parentElement.style.backgroundColor = "#ff8785";
            checkedOption.parentElement.style.borderRadius = "10px";
            checkedOption.parentElement.innerHTML += "❌";
          }
        });
      });

      //timer och progressbar
      const timerElement = document.createElement("h2");
      const progressContainer = document.createElement("div");
      const progressBar = document.createElement("div");

      rootContainer.appendChild(progressContainer);
      progressContainer.appendChild(progressBar);
      progressContainer.appendChild(timerElement);

      //timer och progressbar styling
      progressContainer.style.display = "flex";
      progressContainer.style.alignItems = "center";
      progressContainer.style.width = "100%";
      progressContainer.style.height = "30px";
      progressContainer.style.borderRadius = "10px";
      progressBar.style.borderRadius = "10px";
      progressContainer.style.backgroundColor = "#ddd";
      progressContainer.style.marginTop = "20px";
      progressBar.style.backgroundColor = "#66ff6b";
      progressBar.style.width = "0%";
      progressBar.style.height = "100%";
      progressBar.style.margin = "0";
      progressBar.style.padding = "5px";
      progressBar.style.transition = "width 0.5s ease-in-out";

      timerElement.style.fontSize = "24px";
      timerElement.style.margin = "10px";

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
          nextQuestionBtn.style.display = "none";
          rootContainer.removeChild(progressContainer);
        } else {
          fetchQuestions();
        }
      });
    });

  function showResults() {
    const existingPlayAgainBtn = document.querySelector(".play-again-btn");
    if (existingPlayAgainBtn) {
      return;
    }

    const playAgainBtn = document.createElement("button");
    playAgainBtn.className = "btn btn-success play-again-btn m-2 w-100";
    playAgainBtn.textContent = `You got ${score} answers correct out of 10, do you want to try again?`;

    playAgainBtn.style.display = "block";
    playAgainBtn.style.margin = "0 auto";

    rootContainer.appendChild(playAgainBtn);

    playAgainBtn.addEventListener("click", () => {
      questionIndex = 0;
      score = 0;
      fetchQuestions();
    });
  }
}

fetchQuestions();
