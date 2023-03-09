// Define the database and object store
let db;
const dbName = "urlDB";
const storeName = "urls";

// Open the database connection
const request = indexedDB.open(dbName, 1);
request.onerror = function(event) {
	console.error("Failed to open database: " + event.target.errorCode);
};
request.onsuccess = function(event) {
	db = event.target.result;
	displayUrls();
};

// Create the object store if it doesn't already exist
request.onupgradeneeded = function(event) {
	const db = event.target.result;
	const objectStore = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
};

// Add a URL to the database and display it in the list
function addUrl() {
	const urlInput = document.getElementById("urlInput");
	const url = urlInput.value;
	if (url) {
		const transaction = db.transaction([storeName], "readwrite");
		const objectStore = transaction.objectStore(storeName);
		const request = objectStore.add({ url: url });
		request.onsuccess = function(event) {
			displayUrls();
		};
		urlInput.value = "";
	}
}

// Display the list of URLs from the database
function displayUrls() {
	const urlList = document.getElementById("urlList");
	urlList.innerHTML = "";
	const transaction = db.transaction([storeName], "readonly");
	const objectStore = transaction.objectStore(storeName);
	objectStore.openCursor().onsuccess = function(event) {
		const cursor = event.target.result;
		if (cursor) {
			const url = cursor.value.url;
			const id = cursor.value.id;
			const li = document.createElement("li");
			const deleteButton = document.createElement("button");
			deleteButton.innerText = "Delete";
			deleteButton.onclick = function() { deleteUrl(id); };
			const editButton = document.createElement("button");
			editButton.innerText = "Edit";
			editButton.onclick = function() { editUrl(id, url); };
			li.innerText = url;
			li.appendChild(deleteButton);
			li.appendChild(editButton);
			urlList.appendChild(li);
			cursor.continue();
		}
	};
}

// Delete a URL from the database and update the list
function deleteUrl(id) {
	const transaction = db.transaction([storeName], "readwrite");
	const objectStore = transaction.objectStore(storeName);
	const request = objectStore.delete(id);
	request.onsuccess = function(event) {
		displayUrls();
	};
}

// Update a URL in the database and update the list
function updateUrl(id, url) {
	const transaction = db.transaction([storeName], "readwrite");
	const objectStore = transaction.objectStore(storeName);
	const request = objectStore.put({ id: id, url:url });
request.onsuccess = function(event) {
displayUrls();
};
}

// Clear the list of URLs from the database
function clearUrls() {
	const transaction = db.transaction([storeName], "readwrite");
	const objectStore = transaction.objectStore(storeName);
	const request = objectStore.clear();
	request.onsuccess = function(event) {
		displayUrls();
	};
}



function openAllUrls() {
  const transaction = db.transaction([storeName], "readonly");
  const objectStore = transaction.objectStore(storeName);
  objectStore.openCursor().onsuccess = function(event) {
    const cursor = event.target.result;
    count = 1;
    if (cursor) {
      const url = cursor.value.url;
      const link = document.createElement('a');
      link.href = url;
      document.body.appendChild(link);
      targetName = '_blank' + counter;
      window.open(url, targetName);
      counter = counter + 1;
      cursor.continue();
    }
  };
}

// Clear the list of URLs from the database
function clearUrls() {
	const transaction = db.transaction([storeName], "readwrite");
	const objectStore = transaction.objectStore(storeName);
	const request = objectStore.clear();
	request.onsuccess = function(event) {
		displayUrls();
	};
}




// Edit a URL in the database and display the updated list
function editUrl(id, url) {
const newUrl = prompt("Enter a new URL:", url);
if (newUrl) {
const transaction = db.transaction([storeName], "readwrite");
const objectStore = transaction.objectStore(storeName);
const request = objectStore.put({ id: id, url: newUrl });
request.onsuccess = function(event) {
displayUrls();
};
}
}


