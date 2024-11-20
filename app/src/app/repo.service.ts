import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable ({
    providedIn: 'root'
})
export class RepoService {

    private apiUrl = 'http://your-backend-url';

    constructor() {}

    getRepoFiles(owner:string, repo: string): void {

    }
}