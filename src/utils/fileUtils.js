function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    
    reader.readAsDataURL(file);
  });
}

function downloadAttachedFile(value) {
  if (!value?.url) return;
  
  const a = document.createElement("a");
  
  a.href = value.url;
  a.download = value.name || "arquivo";
  
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export {
  readFileAsDataURL,
  dowloadAttachedFile,
};
