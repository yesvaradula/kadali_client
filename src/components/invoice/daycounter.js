export const getPercentagesForNew = (days) => {
  switch (days) {
    case 0:
      return 0
    case 1:
      return 15
    case 2:
      return 24
    case 3:
      return 31
    case 4:
      return 36
    case 5:
      return 40.5
    case 6:
      return 44.5
    case 7:
      return 48
    case 8:
      return 51
    case 9:
      return 54
    case 10:
      return 57
    case 11:
      return 60
    case 12:
      return 63
    case 13:
      return 66
    case 14:
      return 69
    // second week.
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
      return 83
    // third week
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
      return 95
    default:
      return 105
  }
}

export const getPercentagesForOld = (days) => {
  switch (days) {
    case 0:
      return 0
    case 1:
      return 8
    case 2:
      return 15
    case 3:
      return 21
    case 4:
      return 26
    case 5:
      return 30
    case 6:
      return 33
    case 7:
      return 36
    case 8:
      return 39
    case 9:
      return 42
    case 10:
      return 45
    case 11:
      return 48
    case 12:
      return 51
    case 13:
      return 54
    case 14:
      return 57
    // second week.
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
      return 71
    // third week
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
      return 83
    default:
      return 93
  }
}
