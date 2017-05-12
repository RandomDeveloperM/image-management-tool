import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../shared/reducers";
import {createImage, updateImage} from "../../actions/editor.actions";
import {Observable, Subscription} from "rxjs";
import {ImageService} from "../../services/image.service";
import {ImageGetResponse, TagPostResponse} from "../../shared/responses";
import {ITag} from "../../models/tag.model";
import {createTagError, createTagSuccess, getTags} from "../../actions/tag.actions";
import {TagService} from "../../services/tag.service";
import {CommonValuesHelper} from "./common-values-helper/common-values-helper";

@Component({
    selector: 'app-image-form',
    templateUrl: './image-form.component.html',
    styleUrls: ['./image-form.component.css']
})
export class ImageFormComponent implements OnInit, OnDestroy, OnChanges {

    @Input() items: any[];

    formModel: any;
    images: any[] = [];

    tagsSuggestions: ITag[];
    removedTags: any[] = [];

    isTimePeriod: boolean = false;
    isSavingInProgress: boolean = false;

    subscriptions: Subscription[] = [];

    initialValues: any = {
        comment: undefined,
        fromDay: undefined,
        fromMonth: undefined,
        fromYear: undefined,
        toDay: undefined,
        toMonth: undefined,
        toYear: undefined,
        tags: []
    };

    constructor(private store: Store<AppState>, private commonValuesHelper: CommonValuesHelper, private imageService: ImageService, private tagService: TagService) {
    }

    ngOnInit() {
        this.formModel = this.initialValues;

        if (this.items.length === 1) {
            let item = this.items[0];
            this.subscriptions.push(this.imageService.getImage(encodeURI(item.path), item.fileName)
                .subscribe((response: ImageGetResponse) => {
                    this.images = [response.image || {}]; // push empty object so that Object.assign can be used when saving
                    if (response.image) {
                        this.formModel = Object.assign({}, this.initialValues, response.image);
                    } else {
                        // set path and fileName when no image is found in the database
                        this.formModel = Object.assign({}, this.initialValues, {
                            path: encodeURI(item.path),
                            name: item.fileName
                        });
                    }
                    this.isTimePeriod = this.checkForTimePeriod();
                }));

        } else if (this.items.length > 1) {
            let observables = [];
            this.items.forEach((item) => {
                observables.push(this.imageService.getImage(encodeURI(item.path), item.fileName));
            });

            this.subscriptions.push(Observable.forkJoin(observables)
                .subscribe((responses: ImageGetResponse[]) => {
                    this.images = responses.filter(response => response.image).map((response: ImageGetResponse) => {
                        return response.image;
                    });
                    this.formModel = Object.assign({}, this.initialValues, this.commonValuesHelper.getCommonValues(this.initialValues, this.images));
                    this.isTimePeriod = this.checkForTimePeriod();
                }));
        }

        this.store.dispatch(getTags());

        this.subscriptions.push(this.store.select(state => state.tagsState)
            .subscribe((tagsState) => {
                this.tagsSuggestions = tagsState.tags;
            })
        );
    }

    onTagAdded(addedTag) {
        let foundTag = this.tagsSuggestions.filter(tag => tag.name === addedTag.name).length > 0;
        if (!foundTag) {
            // creating the tag manually (not via Effects), in order to be able to subscribe to the result directly.
            this.tagService.createTag(addedTag)
                .subscribe(
                    (response: TagPostResponse) => {
                        let tag: ITag = response.tag;
                        this.store.dispatch(createTagSuccess(tag));
                        // removing tag from formModel, because the library adds new tags with "id" and "name" attribute set to the given input.
                        // in order to save the tag, we need the correct id, which is auto-generated by the server/database...
                        this.formModel.tags = this.formModel.tags.filter(tag => tag.name !== addedTag.name);
                        // ...and so we push the newly created tag again to the formModel
                        this.formModel.tags.push(tag);
                    },
                    (error) => {
                        this.store.dispatch(createTagError(error));
                    }
                );
        }

        // remove added tag from removed tags
        this.removedTags = this.removedTags.filter((tag) => tag.id !== addedTag.id);
    }

    onTagRemoved(removedTag) {
        this.removedTags.push(removedTag);
    }

    ngOnChanges(changes: SimpleChanges) {
        let currentItems = changes.items.currentValue;
        let remainingImages = [];
        currentItems.forEach((item) => {
            let image = this.images.filter(image => image.path === item.path && image.name === item.fileName)[0];
            if (image) {
                remainingImages.push(image);
            }
        });
        this.images = remainingImages;

        if (remainingImages.length > 0) {
            this.formModel = Object.assign({}, this.initialValues, this.commonValuesHelper.getCommonValues(this.initialValues, this.images));
        } else {
            this.formModel = this.initialValues;
        }

        this.isTimePeriod = this.checkForTimePeriod();
    }

    checkForTimePeriod() {
        return !!(this.formModel.toDay || this.formModel.toMonth || this.formModel.toYear);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    onSubmit() {
        this.items.forEach((item: any) => {
            let relatedImage = this.images.filter(image => image.path === item.path && image.name === item.fileName)[0];
            if (relatedImage) {
                this.store.dispatch(updateImage(Object.assign(relatedImage, this.formModel, { removedTags: this.removedTags })));
            } else {
                this.store.dispatch(createImage(Object.assign(item, this.formModel, { name: item.fileName })));
            }
        });
    }

}