import requests, os

array = [
  "https://i.psnprofiles.com/games/8c6109/trophies/1M9ecdff.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/2M88dfa8.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/3Medd304.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/4M1d685a.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/5M16ff95.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/6M776dd0.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/7M862d4a.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/8Ma89601.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/9M8ff6c4.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/10Mc3fefb.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/11M5d0e42.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/12M0eb572.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/13M9c33b1.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/14Mef4d71.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/15Mc2c612.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/16Ma677fc.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/17Med7024.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/18M56a511.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/19M028d75.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/20Mf63e4d.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/21M156be0.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/22Mf05aeb.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/23Ma44df1.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/24M16c520.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/25Md0f9dd.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/26Me06801.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/27M5b2ea0.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/28M30d169.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/29Mfca969.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/30Mb30af4.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/31Md0eb04.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/32Md6962c.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/33Md5935a.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/34Mfc97ad.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/35M49aed1.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/36M56cc16.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/37M48c807.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/38Mc42644.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/39M376126.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/40M7cc67c.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/41M632418.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/42M6e703f.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/43Mdbdb0a.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/44Mc94c3b.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/45M1f89c1.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/46Mde55d3.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/47M302a2a.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/48M1953d4.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/49Mf76245.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/50Mcf3f10.png",
  "https://i.psnprofiles.com/games/8c6109/trophies/51M81ca5e.png"
]

counter = 1
for url in array:
    response = requests.get(url)
    fileName = "assets/trophy-icons/11995/" + str(counter) + ".png"
    with open(fileName, "wb") as file:
        file.write(response.content)
        file.close()
    counter += 1
