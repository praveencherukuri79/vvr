import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'custom-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnChanges{
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef<HTMLInputElement>;
  @Input() data: Array<any> = [];
  @Input() label: string = 'Input';
  @Input() placeHolder: string = 'Input';
  @Output() selectedEmitter: EventEmitter<Array<any>> = new EventEmitter();

  filterForm: FormGroup;
  SelectedItems: Array<string> = [];
  filteredItems: Observable<string[]>;

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      searchControl: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.data && changes.data.currentValue) {
      this.initFilter();
    }
  }

  initFilter() {
    this.filteredItems = this.filterForm.get('searchControl').valueChanges.pipe(
      startWith(null),
      map((searchItem: string | null) =>
        searchItem
          ? this.searchFilter(searchItem, this.data, this.SelectedItems)
          : this.data.slice().filter((item) => this.SelectedItems.indexOf(item) == -1)
      )
    );
  }

  searchFilter(value: string, list: string[], selectedList: string[]): string[] {
    const filterValue = value.toLowerCase();
    return list.filter((item) => item.toLowerCase().includes(filterValue) && selectedList.indexOf(item) == -1);
  }

  remove(item: string): void {
    const index = this.SelectedItems.indexOf(item);
    if (index >= 0) {
      this.SelectedItems.splice(index, 1);
    }
    this.searchInput.nativeElement.value = '';
    this.filterForm.get('searchControl').setValue(null);

    this.emitSelectedItems();
  }

  select(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (this.SelectedItems.indexOf(value) === -1) {
      this.SelectedItems.push(value);
    }
    this.searchInput.nativeElement.value = '';
    this.filterForm.get('searchControl').setValue(null);

    this.emitSelectedItems();
  }

  emitSelectedItems() {
    this.selectedEmitter.emit(this.SelectedItems);
  }
}
