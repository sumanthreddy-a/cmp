import { environment } from '../../environments/environment';

export class Url {
   getGlobalUrl() {
       return environment.apiBase;
   }
}
