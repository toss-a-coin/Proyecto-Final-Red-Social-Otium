import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';

import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

/* jQUERY */
declare var jQuery:any;
declare var $:any;

@Component({
	selector: 'app-followed',
	templateUrl: './followed.component.html',
	styleUrls: ['../users/users.component.css'] // --> Los estilos son los de Gente
})
export class FollowedComponent implements OnInit {
	public title  : string;
	public url    : string;
	public total  : string;
	public status : string;
	public loading: boolean;
	public noMore : boolean;	// true = no hay más páginas
	public identity;
	public token;
	public page;			// Página actual
	public pages;			// Total de páginas
	public items_per_page;	// Número de elementos por página
	/*public next_page;		// Página siguiente
	public prev_page;		// Página previa
	public paginas;			// Array con el número de páginas (para paginación)*/
	public follows; 		// Ids de los usuarios que nos siguen
	public followed; 		// Array de los usuarios a los que estamos siguiendo
	@Input() user_id: string;	// Usuario sobre el que mostramos resultado

	constructor(
		private _route        : ActivatedRoute,
		private _router       : Router,
		private _userService  : UserService,
		private _followService: FollowService
		) {
		this.title    = "Seguidores";
		this.url      = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token    = this._userService.getToken();
		//this.user_id  = this.identity._id;
		this.page     = 1;
		this.noMore   = false;
		this.loading  = true;
	}

	ngOnInit() {
		this.actualPage();
	}

	actualPage(){
		this._route.params.subscribe(params => {
			if(params['id']){
				this.user_id = params['id'];
				//console.log('Followeds id: '+this.user_id);
			}

			// devolver listado de usuarios
			this.getFollows(this.user_id, this.page);
		});
	}

	getFollows(user_id, page, adding = false){
		this._followService.getFollowed(this.token, user_id, page).subscribe(
			response => {
				/*if(response.user.nick && (this.identity._id != response.user._id)){
					this.title = 'Seguidores de '+response.user.nick;
				}*/
				if(!response.follows){
					this.loading = false;
					this.status = 'error';
				}else{
					this.status = 'success';
					this.loading = false;
					this.total = response.total;
					this.follows = response.users_following;
					this.items_per_page = response.items_per_page;
					this.pages = response.pages;

					if(!adding){
						this.followed = response.follows;
					}else{
						var arrayA = this.followed; 	// lo que tengo hasta ahora
						var arrayB = response.follows;	// la siguiente página que me devuelve
						this.followed = arrayA.concat(arrayB);

						$("html, body").animate({ scrollTop: $('#secction-user').prop("scrollHeight")},500);

						if(page > this.pages){
							this._router.navigate(['/home']);
						}
					}
				
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.loading = false;
					this.status = 'error';
				}
			}
			);
	}

	/** Método para serguir a un usario "followed" **/
	followUser(followed){
		var follow = new Follow('', this.identity._id, followed);

		this._followService.addFollow(this.token, follow).subscribe(
			response => {
				if(!response.follow){
					this.status = 'error';
				}else{
					this.status = 'success';
					this.follows.push(followed);
					this._userService.updateMyStats('following',1);
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
			);
	}

	/** Método para dejar de serguir a un usario "followed" **/
	deleteFollowUser(followed){
		this._followService.deleteFollow(this.token, followed).subscribe(
			response => {
				var search = this.follows.indexOf(followed);
				if(search != -1){
					this.follows.splice(search, 1);
					this._userService.updateMyStats('following',-1);
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
			);
	}

	viewMore(){
		this.page += 1;

		if(this.page == this.pages){
			this.noMore = true;
		}

		this.getFollows(this.user_id, this.page, true);
	}
}
