export default function uniqueID() {
  function chr4() {
    return Math.random()
      .toString(16)
      .slice(-4);
  }
  return (
    chr4() +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    chr4() +
    chr4()
  );
}

// NOTE: This format of 8 chars, followed by 3 groups of 4 chars, followed by 12 chars
//       is known as a UUID and is defined in RFC4122 and is a standard for generating unique IDs.
//       This function DOES NOT implement this standard. It simply outputs a string
//       that looks similar. The standard is found here: https://www.ietf.org/rfc/rfc4122.txt
