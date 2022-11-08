let firstCard = 1;
let secondCard = 2;
let flips = 0;
let timeMax = 30;
let time = timeMax;
let click = 0;
let correct = 0;
const totalPhotos = 8;
const flipTime = 0.4;

const spanTime = document.querySelector(".details .time span");
const spanFlips = document.querySelector(".details .flips span");
const achievementTime = document.querySelector(".achievement .time span");
const achievementFlips = document.querySelector(".achievement .flips span");
const achievementDate = document.querySelector(".achievement .date");
const cardsContainer = document.querySelector(".cards");

function randomArrayNumber(totalPhotos) {
  const random = [];
  while (random.length < totalPhotos * 2) {
    let numRandom = Math.floor(Math.random() * totalPhotos + 1);

    if (random.filter((number) => number === numRandom).length < 2) {
      random.push(numRandom);
    }
  }

  return random;
}

function renderCard() {
  cardsContainer.innerHTML = "";
  randomArrayNumber(8).forEach((number) => {
    cardsContainer.insertAdjacentHTML(
      "beforeend",
      `<li style="transiton: ${flipTime}s ease-in-out;" class="card">
          <div onclick="clickFontView(this)" class="view front-view">
            <ion-icon name="help-outline"></ion-icon>
          </div>
          <div class="view back-view">
          <img src="../images/${number}.png" alt="">
          </div>
      </li>`
    );
  });
}

function clickFontView(_this) {
  const card = _this.parentElement;

  // Lật card đầu tiên
  if (firstCard === 1) {
    _this.style.pointerEvents = "none";

    firstCard = card;
    firstCard.classList.toggle("flip-up");
    flips++;
    spanFlips.innerHTML = flips;
  } else if (secondCard === 2) {
    _this.style.pointerEvents = "none";

    secondCard = card;
    secondCard.classList.toggle("flip-up");
    flips++;
    spanFlips.innerHTML = flips;
  }

  // Kiểm tra matching
  setTimeout(() => {
    const firstSrc = firstCard.querySelector(".back-view img").src;
    const secondSrc =
      secondCard != 2 ? secondCard.querySelector(".back-view img").src : null;
    if (secondSrc != null) {
      if (firstSrc === secondSrc) {
        correct++;
        //  lưu thành tích
        if (correct === totalPhotos) {
          clearInterval(countdown);
          const achievement = JSON.parse(localStorage.getItem("achievement"));
          if (achievement === null) {
            localStorage.setItem(
              "achievement",
              JSON.stringify({
                date: new Date().toDateString(),
                time: time.toFixed(1),
                flips: flips,
              })
            );
          } else {
            if (time.toFixed(1) > achievement.time) {
              localStorage.setItem(
                "achievement",
                JSON.stringify({
                  date: new Date().toDateString(),
                  time: time.toFixed(1),
                  flips,
                })
              );
            } else if (time.toFixed(1) == achievement.time) {
              if (flips < achievement.flips) {
                localStorage.setItem(
                  "achievement",
                  JSON.stringify({
                    date: new Date().toDateString(),
                    time: time.toFixed(1),
                    flips,
                  })
                );
              }
            }
          }

          const getAchievement = JSON.parse(
            localStorage.getItem("achievement")
          );
          achievementDate.innerHTML = getAchievement.date;
          achievementTime.innerHTML = getAchievement.time + "s";
          achievementFlips.innerHTML = getAchievement.flips;
          document.querySelector(".achievement").classList.add("show");
        }
        firstCard = 1;
        secondCard = 2;
      } else {
        firstCard.classList.add("shake");
        secondCard.classList.add("shake");

        // Khi hết hiệu ứng rung
        secondCard.onanimationend = function () {
          firstCard.classList.toggle("shake");
          secondCard.classList.toggle("shake");
          firstCard.classList.toggle("flip-up");
          secondCard.classList.toggle("flip-up");

          firstCard.querySelector(".front-view").style.pointerEvents = "all";
          secondCard.querySelector(".front-view").style.pointerEvents = "all";

          if (time <= 0) {
            secondCard.classList?.remove("flip-up", "shake");
            secondCard.classList?.remove("flip-up", "shake");
          }

          secondCard.onanimationend = function () {};

          firstCard = 1;
          secondCard = 2;
        };
      }
    }
  }, flipTime * 1000);

  // đếm giờ
  if (flips === 1) {
    countdown = setInterval(() => {
      time -= 0.1;
      spanTime.innerHTML = time.toFixed(1) + "s";

      // hết giờ
      if (time <= 0) {
        clearInterval(countdown);
        spanTime.innerHTML = 0 + ".0s";
        // if (correct != totalPhotos) {
        //   cardsContainer.querySelectorAll(".card.flip-up").forEach((card) => {
        //     card.classList.remove("flip-up");
        //   });
        //   firstCard.classList?.remove("flip-up");
        //   firstCard.classList?.remove("flip-up");
        // }
        renderCard();
        firstCard = 1;
        secondCard = 2;
        flips = 0;
        time = timeMax;
        click = 0;
        correct = 0;
        spanTime.innerHTML = time + "s";
        spanFlips.innerHTML = flips;
        clearInterval(countdown);
        countdown = "";
      }
    }, 100);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const audioBtn = document.querySelector(".audio-btn");
  const audio = document.querySelector(".audio audio");
  const refreshBtn = document.querySelector(".refresh-btn");

  spanTime.innerHTML = time + "s";
  spanFlips.innerHTML = flips;
  let countdown = "";
  const getAchievement = JSON.parse(localStorage.getItem("achievement"));

  if (getAchievement != null) {
    document.querySelector(".achievement").classList.add("show");
    achievementDate.innerHTML = getAchievement.date;
    achievementTime.innerHTML = getAchievement.time + "s";
    achievementFlips.innerHTML = getAchievement.flips;
  }

  

  renderCard();

  audioBtn.addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("mute");

    if (e.currentTarget.classList.contains("mute")) {
      audio.muted = true;
    } else {
      audio.muted = false;
    }
  });

  refreshBtn.addEventListener("click", () => {
    renderCard();
    firstCard = 1;
    secondCard = 2;
    flips = 0;
    time = timeMax;
    click = 0;
    correct = 0;
    spanTime.innerHTML = time + "s";
    spanFlips.innerHTML = flips;
    clearInterval(countdown);
    countdown = "";
  });
});
