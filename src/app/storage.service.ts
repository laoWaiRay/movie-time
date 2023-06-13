import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage
  ) { 
    console.log('test storage', storage);
  }

  async getDownloadUrl(url: string): Promise<string> {
    try {
      const downloadURL = await getDownloadURL(ref(this.storage, url));
      return downloadURL;
    } catch (error) {
      console.log(error)
      return '';
    }
  }
}
