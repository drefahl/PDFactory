export const openBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob)
  window.open(url)
}
