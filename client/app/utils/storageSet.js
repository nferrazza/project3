export function setInStorage(key, obj) {
    console.log('importedSet');
    if (!key) {
        console.error('Error: Key Is Missing');
    }

    try{
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (err) {
        console.error(err);
    }
};
