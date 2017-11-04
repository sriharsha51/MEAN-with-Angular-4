import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class BlogService {
  options;
  domain = this.authService.domain;
  
    constructor(private http: Http,
                private authService: AuthService) { }
  
    createAuthenticationHeaders() {
      this.authService.loadToken();
      this.options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/json',
          'authorization': this.authService.authToken
        })
      });
    }

    newBlog(blog) {//create headers
      this.createAuthenticationHeaders(); //all middleware after authentication middleware needs authToken to be sent to backend for authentication 
      return this.http.post(this.domain + 'blogs/newBlog', blog, this.options).map(res => res.json());
    }

    getAllBlogs() {
      this.createAuthenticationHeaders();//create and send headers
      return this.http.get(this.domain + 'blogs/allBlogs', this.options).map(res => res.json());
    }

    getSingleBlog(id) {
      this.createAuthenticationHeaders();
      return this.http.get(this.domain + 'blogs/singleBlog/' + id, this.options).map(res => res.json());
    }

    editBlog(blog) {
      this.createAuthenticationHeaders();
      return this.http.put(this.domain + 'blogs/updateBlog/', blog, this.options).map(res => res.json());
    }

    deleteBlog(id) {
      this.createAuthenticationHeaders();
      return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, this.options).map(res => res.json());
    }

    likeBlog(id) {
      const blogData = { id: id };
      return this.http.put(this.domain + 'blogs/likeBlog/', blogData, this.options).map(res => res.json());
    }

    dislikeBlog(id) {
      const blogData = { id: id };
      return this.http.put(this.domain + 'blogs/dislikeBlog/', blogData, this.options).map(res => res.json());
    }

    postComment(id, comment) {
      this.createAuthenticationHeaders();
      const blogData = {
        id: id,
        comment: comment
      }
      return this.http.post(this.domain + 'blogs/comment', blogData, this.options).map(res => res.json());
    }
  }
