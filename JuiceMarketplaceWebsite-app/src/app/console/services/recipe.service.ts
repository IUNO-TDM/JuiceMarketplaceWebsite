import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { TdmCocktailRecipe } from 'tdm-common';

@Injectable()
export class RecipeService {
    // @see https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
    // This is to prevent the service clients from themselves emitting store values directly instead of calling action methods and therefore bypassing the store.
    private _recipes: BehaviorSubject<TdmCocktailRecipe[]> = new BehaviorSubject([]);
    public readonly recipes: Observable<TdmCocktailRecipe[]> = this._recipes.asObservable();

    private recipesUrl = '/api/users/me/recipes';

    constructor(private http: HttpClient) {
        this.updateRecipes();
    }

    updateRecipes() {
        this.http.get<TdmCocktailRecipe[]>(this.recipesUrl).subscribe(recipes => {
            this._recipes.next(recipes);
        }, error => {
            this.handleError(error);
        });
    }

    deleteRecipe(recipe: TdmCocktailRecipe) {
        this.http.delete(this.recipesUrl + "/" + recipe.id, {
            responseType: 'text',
        }).subscribe(response => {
            this.updateRecipes();
        });
    }

    getRecipeCount(): Observable<number>{
        let url = this.recipesUrl+'/count';
        return this.http.get(url).map((obj: any)=>{
            return obj.count;
        })
    }

    getRecipeLimit(): Observable<number>{
        let url = this.recipesUrl+'/limit';
        return this.http.get(url).map((obj: any)=>{
            return obj.limit;
        })
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
