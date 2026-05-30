const axios = require("axios")

const API =
  "http://localhost:3000/attendance"

const autoCheckout = async () => {

  try {

    const res =
      await axios.get(API)

    const attendance =
      res.data

    const today =
      new Date().toLocaleDateString()

    const currentHour =
      new Date().getHours()

    // 🔥 ONLY AFTER 9 PM
    if (currentHour >= 21) {

      attendance.forEach(async (a) => {

        // ✅ today attendance
        // ✅ checked in
        // ✅ no checkout

        if (
          a.date === today &&
          a.checkIn &&
          !a.checkOut
        ) {

          await axios.patch(
            `${API}/${a.id}`,
            {
              checkOut:
                "Auto Checkout"
            }
          )

          console.log(
            `Auto checkout done for ${a.name}`
          )
        }
      })
    }

  } catch (err) {

    console.log(err.message)
  }
}

// 🔥 EVERY 1 MINUTE CHECK
setInterval(
  autoCheckout,
  60000
)

console.log(
  "Auto checkout server running..."
)