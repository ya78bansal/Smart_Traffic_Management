function getSignalColor(count) {
  if (count > 20) return "GREEN";      // heavy traffic
  if (count > 10) return "YELLOW";     // moderate traffic
  return "RED";                        // low traffic
}

module.exports = { getSignalColor };
