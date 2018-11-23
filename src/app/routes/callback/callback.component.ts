import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SocialService, ZN_SOCIAL_SERVICE_TOKEN } from '@shared/modules/auth';
import { StartupService } from '@core/startup/startup.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.less'],
  providers: [{
    provide: ZN_SOCIAL_SERVICE_TOKEN,
    useClass: SocialService
  }],
})
export class CallbackComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private routeInfo: ActivatedRoute,
    private startupService: StartupService,
    @Inject(ZN_SOCIAL_SERVICE_TOKEN) private socialService: SocialService,
  ){}

  private httpToken(url: string, params: any){
    const opts: any = {
      params: params,
      responseType: 'text',
    };
    this.http.get(url, opts).subscribe(v => {
      if(this.socialService.callback(v as any)){
        this.startupService.setup().then(() => {
          this.router.navigateByUrl(this.socialService.currentOptions.redirect_url);
        });
      }else{
        this.router.navigateByUrl(this.socialService.currentOptions.login_url);
      }
    });
  }

  ngOnInit() {
    const snapshot = this.routeInfo.snapshot;

    let type = snapshot.paramMap.get('type');
    let code = snapshot.queryParamMap.get('code');

    let client_id = '86f8efc0a0c51e127cd3';
    let client_secret = `2d8faaf7dcd97f365014f4e0575ce4e6852fc67d`;
    let redirect_url = `http://192.168.0.110:4200/callback/github`;

    const params = new HttpParams()
      .set('client_id', client_id)
      .set('client_secret', client_secret)
      .set('code', code)
      .set('redirect_uri', redirect_url);

    const url = `/github/login/oauth/access_token`;
    this.httpToken(url, params);
  }
}
