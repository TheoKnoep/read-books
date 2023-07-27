/**
 * Test de code généré avec ChatGPT 
 * 
 * Use : 
 * - instanciate : let db = new IndexedDB(< name : String >, < table name : String >, < version : String >); 
 * - add entries : db.setData('key', 'value').then(done => console.log(done)); 
 * - retrieve entry : db.getGata('key').then(data => console.log(data)); 
 */

class IndexedDB {
    constructor(dbName, storeName, version) {
      this.dbName = dbName;
      this.storeName = storeName;
      this.version = version;
      this.db = null;
    }
  
    async openDB() {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(this.dbName, this.version);
        request.onerror = event => {
          reject(request.error);
        };
        request.onsuccess = event => {
          this.db = event.target.result;
          resolve();
        };
        request.onupgradeneeded = event => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName);
          }
        };
      });
    }
  
    async getData(key) {
        return this.openDB().then(
            () => {
                return new Promise((resolve, reject) => {
                    const transaction = this.db.transaction([this.storeName], 'readonly');
                    const objectStore = transaction.objectStore(this.storeName);
                    const request = objectStore.get(key);
                    request.onerror = event => {
                      reject(request.error);
                    };
                    request.onsuccess = event => {
                      resolve(JSON.parse(event.target.result));
                    };
                  });
            }
        )

    }
  
    async setData(key, value) {
        return this.openDB()
            .then(() => {
                return new Promise((resolve, reject) => {
                    const transaction = this.db.transaction([this.storeName], 'readwrite');
                    const objectStore = transaction.objectStore(this.storeName);
                    const request = objectStore.put(value, key);
                    request.onerror = event => {
                      reject(request.error);
                    };
                    request.onsuccess = event => {
                      resolve('done');
                    };
                  });
            })
    }
  
    async deleteData(key) {
      return this.openDB()
      .then(() => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([this.storeName], 'readwrite');
          const objectStore = transaction.objectStore(this.storeName);
          const request = objectStore.delete(key);
          request.onerror = event => {
            reject(request.error);
          };
          request.onsuccess = event => {
            resolve();
          };
        });
      })

    }

    async getListOfKeys() {
      return this.openDB()
        .then(() => {
          return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly'); 
            const objectStore = transaction.objectStore(this.storeName); 
            const getAllKeysRequest = objectStore.getAllKeys();

            getAllKeysRequest.onsuccess = (event) => {
              const keys = event.target.result;
              resolve(keys); 
            }
            getAllKeysRequest.onerror = (event) => {
              reject(event.target.error); 
            }
            transaction.oncomplete = function() {
              this.db.close(); 
            }
          })
        })

    }


  }





// ANNEXES : 
function getAllKeysFromTable(tableName, databaseName, successCallback, errorCallback) {
    // Ouvrir la base de données en utilisant l'API IndexedDB
    const request = indexedDB.open(databaseName);
  
    request.onsuccess = function (event) {
      const db = event.target.result;
  
      // Commencer une transaction en lecture seule sur la table spécifiée
      const transaction = db.transaction([tableName], 'readonly');
  
      // Obtenir une référence à la table
      const objectStore = transaction.objectStore(tableName);
  
      // Créer une requête pour récupérer toutes les clés
      const getAllKeysRequest = objectStore.getAllKeys();
  
      // Gérer le succès de la requête
      getAllKeysRequest.onsuccess = function (event) {
        const keys = event.target.result;
        successCallback(keys);
      };
  
      // Gérer les erreurs de la requête
      getAllKeysRequest.onerror = function (event) {
        errorCallback(event.target.error);
      };
  
      // Fermer la transaction lorsque toutes les opérations sont terminées
      transaction.oncomplete = function () {
        db.close();
      };
    };
  
    // Gérer les erreurs lors de l'ouverture de la base de données
    request.onerror = function (event) {
      errorCallback(event.target.error);
    };
  }
  