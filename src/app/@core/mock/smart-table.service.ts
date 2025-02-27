import { Injectable } from '@angular/core';
import { SmartTableData } from '../data/smart-table';

@Injectable()
export class SmartTableService extends SmartTableData {

  data = [{
    id: 1,
    firstName: 'Mark',
    lastName: 'Otto',
    username: '@mdo',
    email: 'mdo@gmail.com',
    age: '28',
  }, {
    id: 2,
    firstName: 'Jacob',
    lastName: 'Thornton',
    username: '@fat',
    email: 'fat@yandex.ru',
    age: '45',
  }, {
    id: 3,
    firstName: 'Larry',
    lastName: 'Bird',
    username: '@twitter',
    email: 'twitter@outlook.com',
    age: '18',
  }, {
    id: 4,
    firstName: 'John',
    lastName: 'Snow',
    username: '@snow',
    email: 'snow@gmail.com',
    age: '20',
  }, {
    id: 5,
    firstName: 'Jack',
    lastName: 'Sparrow',
    username: '@jack',
    email: 'jack@yandex.ru',
    age: '30',
  }, {
    id: 6,
    firstName: 'Ann',
    lastName: 'Smith',
    username: '@ann',
    email: 'ann@gmail.com',
    age: '21',
  }, {
    id: 7,
    firstName: 'Barbara',
    lastName: 'Black',
    username: '@barbara',
    email: 'barbara@yandex.ru',
    age: '43',
  }, {
    id: 8,
    firstName: 'Sevan',
    lastName: 'Bagrat',
    username: '@sevan',
    email: 'sevan@outlook.com',
    age: '13',
  }, {
    id: 9,
    firstName: 'Ruben',
    lastName: 'Vardan',
    username: '@ruben',
    email: 'ruben@gmail.com',
    age: '22',
  }, {
    id: 10,
    firstName: 'Karen',
    lastName: 'Sevan',
    username: '@karen',
    email: 'karen@yandex.ru',
    age: '33',
  }, {
    id: 11,
    firstName: 'Mark',
    lastName: 'Otto',
    username: '@mark',
    email: 'mark@gmail.com',
    age: '38',
  }, {
    id: 12,
    firstName: 'Jacob',
    lastName: 'Thornton',
    username: '@jacob',
    email: 'jacob@yandex.ru',
    age: '48',
  }, {
    id: 13,
    firstName: 'Haik',
    lastName: 'Hakob',
    username: '@haik',
    email: 'haik@outlook.com',
    age: '48',
  }, {
    id: 14,
    firstName: 'Garegin',
    lastName: 'Jirair',
    username: '@garegin',
    email: 'garegin@gmail.com',
    age: '40',
  }, {
    id: 15,
    firstName: 'Krikor',
    lastName: 'Bedros',
    username: '@krikor',
    email: 'krikor@yandex.ru',
    age: '32',
  }, {
    'id': 16,
    'firstName': 'Francisca',
    'lastName': 'Brady',
    'username': '@Gibson',
    'email': 'franciscagibson@comtours.com',
    'age': 11,
  }, {
    'id': 17,
    'firstName': 'Tillman',
    'lastName': 'Figueroa',
    'username': '@Snow',
    'email': 'tillmansnow@comtours.com',
    'age': 34,
  }, {
    'id': 18,
    'firstName': 'Jimenez',
    'lastName': 'Morris',
    'username': '@Bryant',
    'email': 'jimenezbryant@comtours.com',
    'age': 45,
  }, {
    'id': 19,
    'firstName': 'Sandoval',
    'lastName': 'Jacobson',
    'username': '@Mcbride',
    'email': 'sandovalmcbride@comtours.com',
    'age': 32,
  }, {
    'id': 20,
    'firstName': 'Griffin',
    'lastName': 'Torres',
    'username': '@Charles',
    'email': 'griffincharles@comtours.com',
    'age': 19,
  }, {
    'id': 21,
    'firstName': 'Cora',
    'lastName': 'Parker',
    'username': '@Caldwell',
    'email': 'coracaldwell@comtours.com',
    'age': 27,
  }, {
    'id': 22,
    'firstName': 'Cindy',
    'lastName': 'Bond',
    'username': '@Velez',
    'email': 'cindyvelez@comtours.com',
    'age': 24,
  }, {
    'id': 23,
    'firstName': 'Frieda',
    'lastName': 'Tyson',
    'username': '@Craig',
    'email': 'friedacraig@comtours.com',
    'age': 45,
  }, {
    'id': 24,
    'firstName': 'Cote',
    'lastName': 'Holcomb',
    'username': '@Rowe',
    'email': 'coterowe@comtours.com',
    'age': 20,
  }, {
    'id': 25,
    'firstName': 'Trujillo',
    'lastName': 'Mejia',
    'username': '@Valenzuela',
    'email': 'trujillovalenzuela@comtours.com',
    'age': 16,
  }, {
    'id': 26,
    'firstName': 'Pruitt',
    'lastName': 'Shepard',
    'username': '@Sloan',
    'email': 'pruittsloan@comtours.com',
    'age': 44,
  }, {
    'id': 27,
    'firstName': 'Sutton',
    'lastName': 'Ortega',
    'username': '@Black',
    'email': 'suttonblack@comtours.com',
    'age': 42,
  }, {
    'id': 28,
    'firstName': 'Marion',
    'lastName': 'Heath',
    'username': '@Espinoza',
    'email': 'marionespinoza@comtours.com',
    'age': 47,
  }, {
    'id': 29,
    'firstName': 'Newman',
    'lastName': 'Hicks',
    'username': '@Keith',
    'email': 'newmankeith@comtours.com',
    'age': 15,
  }, {
    'id': 30,
    'firstName': 'Boyle',
    'lastName': 'Larson',
    'username': '@Summers',
    'email': 'boylesummers@comtours.com',
    'age': 32,
  }, {
    'id': 31,
    'firstName': 'Haynes',
    'lastName': 'Vinson',
    'username': '@Mckenzie',
    'email': 'haynesmckenzie@comtours.com',
    'age': 15,
  }, {
    'id': 32,
    'firstName': 'Miller',
    'lastName': 'Acosta',
    'username': '@Young',
    'email': 'milleryoung@comtours.com',
    'age': 55,
  }, {
    'id': 33,
    'firstName': 'Johnston',
    'lastName': 'Brown',
    'username': '@Knight',
    'email': 'johnstonknight@comtours.com',
    'age': 29,
  }, {
    'id': 34,
    'firstName': 'Lena',
    'lastName': 'Pitts',
    'username': '@Forbes',
    'email': 'lenaforbes@comtours.com',
    'age': 25,
  }, {
    'id': 35,
    'firstName': 'Terrie',
    'lastName': 'Kennedy',
    'username': '@Branch',
    'email': 'terriebranch@comtours.com',
    'age': 37,
  }, {
    'id': 36,
    'firstName': 'Louise',
    'lastName': 'Aguirre',
    'username': '@Kirby',
    'email': 'louisekirby@comtours.com',
    'age': 44,
  }, {
    'id': 37,
    'firstName': 'David',
    'lastName': 'Patton',
    'username': '@Sanders',
    'email': 'davidsanders@comtours.com',
    'age': 26,
  }, {
    'id': 38,
    'firstName': 'Holden',
    'lastName': 'Barlow',
    'username': '@Mckinney',
    'email': 'holdenmckinney@comtours.com',
    'age': 11,
  }, {
    'id': 39,
    'firstName': 'Baker',
    'lastName': 'Rivera',
    'username': '@Montoya',
    'email': 'bakermontoya@comtours.com',
    'age': 47,
  }, {
    'id': 40,
    'firstName': 'Belinda',
    'lastName': 'Lloyd',
    'username': '@Calderon',
    'email': 'belindacalderon@comtours.com',
    'age': 21,
  }, {
    'id': 41,
    'firstName': 'Pearson',
    'lastName': 'Patrick',
    'username': '@Clements',
    'email': 'pearsonclements@comtours.com',
    'age': 42,
  }, {
    'id': 42,
    'firstName': 'Alyce',
    'lastName': 'Mckee',
    'username': '@Daugherty',
    'email': 'alycedaugherty@comtours.com',
    'age': 55,
  }, {
    'id': 43,
    'firstName': 'Valencia',
    'lastName': 'Spence',
    'username': '@Olsen',
    'email': 'valenciaolsen@comtours.com',
    'age': 20,
  }, {
    'id': 44,
    'firstName': 'Leach',
    'lastName': 'Holcomb',
    'username': '@Humphrey',
    'email': 'leachhumphrey@comtours.com',
    'age': 28,
  }, {
    'id': 45,
    'firstName': 'Moss',
    'lastName': 'Baxter',
    'username': '@Fitzpatrick',
    'email': 'mossfitzpatrick@comtours.com',
    'age': 51,
  }, {
    'id': 46,
    'firstName': 'Jeanne',
    'lastName': 'Cooke',
    'username': '@Ward',
    'email': 'jeanneward@comtours.com',
    'age': 59,
  }, {
    'id': 47,
    'firstName': 'Wilma',
    'lastName': 'Briggs',
    'username': '@Kidd',
    'email': 'wilmakidd@comtours.com',
    'age': 53,
  }, {
    'id': 48,
    'firstName': 'Beatrice',
    'lastName': 'Perry',
    'username': '@Gilbert',
    'email': 'beatricegilbert@comtours.com',
    'age': 39,
  }, {
    'id': 49,
    'firstName': 'Whitaker',
    'lastName': 'Hyde',
    'username': '@Mcdonald',
    'email': 'whitakermcdonald@comtours.com',
    'age': 35,
  }, {
    'id': 50,
    'firstName': 'Rebekah',
    'lastName': 'Duran',
    'username': '@Gross',
    'email': 'rebekahgross@comtours.com',
    'age': 40,
  }, {
    'id': 51,
    'firstName': 'Earline',
    'lastName': 'Mayer',
    'username': '@Woodward',
    'email': 'earlinewoodward@comtours.com',
    'age': 52,
  }, {
    'id': 52,
    'firstName': 'Moran',
    'lastName': 'Baxter',
    'username': '@Johns',
    'email': 'moranjohns@comtours.com',
    'age': 20,
  }, {
    'id': 53,
    'firstName': 'Nanette',
    'lastName': 'Hubbard',
    'username': '@Cooke',
    'email': 'nanettecooke@comtours.com',
    'age': 55,
  }, {
    'id': 54,
    'firstName': 'Dalton',
    'lastName': 'Walker',
    'username': '@Hendricks',
    'email': 'daltonhendricks@comtours.com',
    'age': 25,
  }, {
    'id': 55,
    'firstName': 'Bennett',
    'lastName': 'Blake',
    'username': '@Pena',
    'email': 'bennettpena@comtours.com',
    'age': 13,
  }, {
    'id': 56,
    'firstName': 'Kellie',
    'lastName': 'Horton',
    'username': '@Weiss',
    'email': 'kellieweiss@comtours.com',
    'age': 48,
  }, {
    'id': 57,
    'firstName': 'Hobbs',
    'lastName': 'Talley',
    'username': '@Sanford',
    'email': 'hobbssanford@comtours.com',
    'age': 28,
  }, {
    'id': 58,
    'firstName': 'Mcguire',
    'lastName': 'Donaldson',
    'username': '@Roman',
    'email': 'mcguireroman@comtours.com',
    'age': 38,
  }, {
    'id': 59,
    'firstName': 'Rodriquez',
    'lastName': 'Saunders',
    'username': '@Harper',
    'email': 'rodriquezharper@comtours.com',
    'age': 20,
  }, {
    'id': 60,
    'firstName': 'Lou',
    'lastName': 'Conner',
    'username': '@Sanchez',
    'email': 'lousanchez@comtours.com',
    'age': 16,
  }];

  company = [
    { id: 1, name: "John Doe", address: "123 Main St, NY", max_asset_count: 5 },
    { id: 2, name: "Jane Smith", address: "456 Elm St, CA", max_asset_count: 10 },
    { id: 3, name: "Alice Johnson", address: "789 Oak St, TX", max_asset_count: 8 },
    { id: 4, name: "Bob Brown", address: "321 Pine St, FL", max_asset_count: 7 },
    { id: 5, name: "Charlie White", address: "654 Cedar St, AZ", max_asset_count: 12 },
    { id: 6, name: "David Black", address: "987 Birch St, IL", max_asset_count: 15 },
    { id: 7, name: "Emma Green", address: "741 Maple St, WA", max_asset_count: 6 },
    { id: 8, name: "Frank Harris", address: "852 Walnut St, OR", max_asset_count: 9 },
    { id: 9, name: "Grace Lee", address: "963 Spruce St, NV", max_asset_count: 11 },
    { id: 10, name: "Henry Adams", address: "159 Redwood St, CO", max_asset_count: 4 },
    { id: 11, name: "Isabella Martinez", address: "753 Cypress St, GA", max_asset_count: 8 },
    { id: 12, name: "Jack Wilson", address: "357 Palm St, NC", max_asset_count: 14 },
    { id: 13, name: "Kelly Thompson", address: "258 Hickory St, MI", max_asset_count: 3 },
    { id: 14, name: "Liam Scott", address: "951 Aspen St, OH", max_asset_count: 7 },
    { id: 15, name: "Mia Brown", address: "852 Chestnut St, VA", max_asset_count: 6 },
    { id: 16, name: "Noah Walker", address: "369 Poplar St, PA", max_asset_count: 9 },
    { id: 17, name: "Olivia Hall", address: "147 Magnolia St, MA", max_asset_count: 13 },
    { id: 18, name: "Paul Young", address: "258 Juniper St, TN", max_asset_count: 2 },
    { id: 19, name: "Quinn King", address: "369 Dogwood St, MN", max_asset_count: 5 },
    { id: 20, name: "Rachel Parker", address: "741 Fir St, WI", max_asset_count: 10 }
  ];

  asset = [
    { id: 1, company_id: 101, sponsored_by: 201, name: "John Doe", id_number: "ID12345", iqama_expiry: "2025-08-10", phone: "1234567890", designation: "Engineer", passport: 987654, passport_expiry: "2030-05-12", joining_date: "2022-01-15", asset_type: 1, asset_number: 5001 },
    { id: 2, company_id: 102, sponsored_by: 202, name: "Alice Smith", id_number: "ID23456", iqama_expiry: "2026-01-22", phone: "9876543210", designation: "Manager", passport: 876543, passport_expiry: "2029-11-30", joining_date: "2021-06-01", asset_type: 2, asset_number: 5002 },
    { id: 3, company_id: 103, sponsored_by: null, name: "David Johnson", id_number: "ID34567", iqama_expiry: "2027-09-15", phone: "4561237890", designation: "Technician", passport: 765432, passport_expiry: "2032-02-20", joining_date: "2023-03-10", asset_type: 1, asset_number: 5003 },
    { id: 4, company_id: 101, sponsored_by: 203, name: "Sarah Lee", id_number: "ID45678", iqama_expiry: "2025-12-30", phone: "7418529630", designation: "Supervisor", passport: 654321, passport_expiry: "2031-07-15", joining_date: "2020-08-22", asset_type: 3, asset_number: 5004 },
    { id: 5, company_id: 102, sponsored_by: null, name: "Michael Brown", id_number: "ID56789", iqama_expiry: "2024-07-25", phone: "3698521470", designation: "Developer", passport: 543210, passport_expiry: "2028-12-05", joining_date: "2021-12-10", asset_type: 2, asset_number: 5005 },
    { id: 6, company_id: 104, sponsored_by: 204, name: "Emily Davis", id_number: "ID67890", iqama_expiry: "2026-06-18", phone: "2583691470", designation: "HR", passport: 432109, passport_expiry: "2027-09-10", joining_date: "2022-04-05", asset_type: 1, asset_number: 5006 },
    { id: 7, company_id: 103, sponsored_by: null, name: "Robert Wilson", id_number: "ID78901", iqama_expiry: "2028-03-11", phone: "1472583690", designation: "Accountant", passport: 321098, passport_expiry: "2030-10-25", joining_date: "2023-07-18", asset_type: 3, asset_number: 5007 },
    { id: 8, company_id: 101, sponsored_by: 205, name: "Sophia Martinez", id_number: "ID89012", iqama_expiry: "2025-11-05", phone: "1593578520", designation: "Engineer", passport: 210987, passport_expiry: "2029-03-14", joining_date: "2021-10-20", asset_type: 2, asset_number: 5008 },
    { id: 9, company_id: 105, sponsored_by: null, name: "James Anderson", id_number: "ID90123", iqama_expiry: "2027-08-20", phone: "1231231234", designation: "Admin", passport: 109876, passport_expiry: "2031-06-30", joining_date: "2020-12-15", asset_type: 1, asset_number: 5009 },
    { id: 10, company_id: 102, sponsored_by: 206, name: "Olivia Thomas", id_number: "ID01234", iqama_expiry: "2026-04-28", phone: "9879879876", designation: "Developer", passport: 198765, passport_expiry: "2030-01-18", joining_date: "2022-08-10", asset_type: 2, asset_number: 5010 },
    { id: 11, company_id: 101, sponsored_by: null, name: "William Garcia", id_number: "ID13579", iqama_expiry: "2025-05-12", phone: "1239874560", designation: "Technician", passport: 287654, passport_expiry: "2028-07-22", joining_date: "2021-09-10", asset_type: 1, asset_number: 5011 },
    { id: 12, company_id: 106, sponsored_by: 207, name: "Emma Harris", id_number: "ID24680", iqama_expiry: "2028-09-30", phone: "7894561230", designation: "HR", passport: 765432, passport_expiry: "2033-05-05", joining_date: "2023-11-15", asset_type: 3, asset_number: 5012 },
    { id: 13, company_id: 107, sponsored_by: null, name: "Noah Adams", id_number: "ID35791", iqama_expiry: "2027-02-18", phone: "4567891230", designation: "Engineer", passport: 654321, passport_expiry: "2032-10-10", joining_date: "2020-03-30", asset_type: 1, asset_number: 5013 },
    { id: 14, company_id: 108, sponsored_by: 208, name: "Liam Scott", id_number: "ID46802", iqama_expiry: "2025-06-25", phone: "8523697410", designation: "Supervisor", passport: 543210, passport_expiry: "2029-09-15", joining_date: "2021-07-22", asset_type: 2, asset_number: 5014 },
    { id: 15, company_id: 109, sponsored_by: null, name: "Mia Brown", id_number: "ID57913", iqama_expiry: "2026-11-10", phone: "3216549870", designation: "Developer", passport: 432109, passport_expiry: "2027-12-20", joining_date: "2022-05-18", asset_type: 3, asset_number: 5015 },
    { id: 16, company_id: 110, sponsored_by: 209, name: "Olivia Hall", id_number: "ID68024", iqama_expiry: "2028-08-05", phone: "7412589630", designation: "HR", passport: 321098, passport_expiry: "2031-02-14", joining_date: "2023-06-25", asset_type: 1, asset_number: 5016 },
    { id: 17, company_id: 111, sponsored_by: null, name: "Paul Young", id_number: "ID79135", iqama_expiry: "2029-01-20", phone: "9513578520", designation: "Technician", passport: 210987, passport_expiry: "2034-07-10", joining_date: "2020-12-30", asset_type: 2, asset_number: 5017 },
  ];
  
  projects = [
    { id: 1, company_id: 1, client_id: 2, project_id: "PRJ-001", name: "Skyline Towers", location: "New York, NY", end_date: "2024-01-15", start_date: "2026-06-20" },
    { id: 2, company_id: 3, client_id: 5, project_id: "PRJ-002", name: "Green Valley", location: "Los Angeles, CA", end_date: "2023-05-10", start_date: "2025-09-30" },
    { id: 3, company_id: 2, client_id: 4, project_id: "PRJ-003", name: "Oceanview Complex", location: "Miami, FL", end_date: "2022-09-01", start_date: "2025-03-15" },
    { id: 4, company_id: 4, client_id: 6, project_id: "PRJ-004", name: "Tech Hub", location: "San Francisco, CA", end_date: "2023-07-20", start_date: "2026-01-25" },
    { id: 5, company_id: 5, client_id: 1, project_id: "PRJ-005", name: "Metro Plaza", location: "Chicago, IL", end_date: "2022-11-11", start_date: "2025-12-10" },
    { id: 6, company_id: 1, client_id: 3, project_id: "PRJ-006", name: "Sunrise Apartments", location: "Dallas, TX", end_date: "2024-02-05", start_date: "2026-08-18" },
    { id: 7, company_id: 3, client_id: 7, project_id: "PRJ-007", name: "Corporate Heights", location: "Seattle, WA", end_date: "2023-06-14", start_date: "2027-04-21" },
    { id: 8, company_id: 2, client_id: 8, project_id: "PRJ-008", name: "Future Park", location: "Boston, MA", end_date: "2021-12-01", start_date: "2024-10-15" },
    { id: 9, company_id: 4, client_id: 9, project_id: "PRJ-009", name: "Industrial Zone", location: "Houston, TX", end_date: "2023-04-03", start_date: "2025-07-28" },
    { id: 10, company_id: 5, client_id: 10, project_id: "PRJ-010", name: "Innovation Lab", location: "Austin, TX", end_date: "2024-01-25", start_date: "2026-12-05" },
    { id: 11, company_id: 1, client_id: 11, project_id: "PRJ-011", name: "Sky High Mall", location: "Denver, CO", end_date: "2023-09-30", start_date: "2026-05-18" },
    { id: 12, company_id: 3, client_id: 12, project_id: "PRJ-012", name: "Luxury Villas", location: "Phoenix, AZ", end_date: "2023-11-10", start_date: "2027-06-22" },
    { id: 13, company_id: 2, client_id: 13, project_id: "PRJ-013", name: "Silver Heights", location: "Philadelphia, PA", end_date: "2022-10-15", start_date: "2025-08-17" },
    { id: 14, company_id: 4, client_id: 14, project_id: "PRJ-014", name: "E-Commerce Hub", location: "San Diego, CA", end_date: "2024-03-12", start_date: "2027-02-28" },
    { id: 15, company_id: 5, client_id: 15, project_id: "PRJ-015", name: "Medical Research Center", location: "Atlanta, GA", end_date: "2023-08-20", start_date: "2026-11-30" },
    { id: 16, company_id: 1, client_id: 16, project_id: "PRJ-016", name: "Solar Farm", location: "Las Vegas, NV", end_date: "2023-02-25", start_date: "2026-07-19" },
    { id: 17, company_id: 3, client_id: 17, project_id: "PRJ-017", name: "Automobile Plant", location: "Detroit, MI", end_date: "2023-07-01", start_date: "2026-09-10" },
    { id: 18, company_id: 2, client_id: 18, project_id: "PRJ-018", name: "AI Research Lab", location: "Palo Alto, CA", end_date: "2024-05-06", start_date: "2027-01-14" },
    { id: 19, company_id: 4, client_id: 19, project_id: "PRJ-019", name: "Data Center", location: "Chicago, IL", end_date: "2022-06-18", start_date: "2025-12-08" },
    { id: 20, company_id: 5, client_id: 20, project_id: "PRJ-020", name: "Eco-Friendly Village", location: "Portland, OR", end_date: "2023-09-22", start_date: "2026-10-05" },
  ];

  users = [
    { id: 1, username: "john_doe", password: "pass123", create_date: "2024-01-15", update_date: "2024-02-10", company_id: 1 },
    { id: 2, username: "jane_smith", password: "securePass", create_date: "2024-01-20", update_date: "2024-02-11", company_id: 2 },
    { id: 3, username: "alice_jones", password: "alicePass", create_date: "2024-02-01", update_date: "2024-02-12", company_id: 3 },
    { id: 4, username: "bob_brown", password: "bobSecure", create_date: "2024-02-05", update_date: "2024-02-13", company_id: 4 },
    { id: 5, username: "charlie_adams", password: "charlie123", create_date: "2024-02-10", update_date: "2024-02-14", company_id: 5 },
    { id: 6, username: "david_white", password: "davidPass", create_date: "2024-02-15", update_date: "2024-02-15", company_id: 6 },
    { id: 7, username: "emily_clark", password: "emilySecure", create_date: "2024-02-20", update_date: "2024-02-16", company_id: 7 },
    { id: 8, username: "frank_hill", password: "frankPass", create_date: "2024-02-25", update_date: "2024-02-17", company_id: 8 },
    { id: 9, username: "george_moore", password: "georgeSecure", create_date: "2024-03-01", update_date: "2024-02-18", company_id: 9 },
    { id: 10, username: "hannah_scott", password: "hannahPass", create_date: "2024-03-05", update_date: "2024-02-19", company_id: 10 },
    { id: 11, username: "ian_evans", password: "ianSecure", create_date: "2024-03-10", update_date: "2024-02-20", company_id: 11 },
    { id: 12, username: "jessica_wilson", password: "jessicaPass", create_date: "2024-03-15", update_date: "2024-02-21", company_id: 12 },
    { id: 13, username: "kevin_thomas", password: "kevinSecure", create_date: "2024-03-20", update_date: "2024-02-22", company_id: 13 },
    { id: 14, username: "laura_martin", password: "lauraPass", create_date: "2024-03-25", update_date: "2024-02-23", company_id: 14 },
    { id: 15, username: "michael_anderson", password: "michaelSecure", create_date: "2024-03-30", update_date: "2024-02-24", company_id: 15 },
    { id: 16, username: "natalie_roberts", password: "nataliePass", create_date: "2024-04-01", update_date: "2024-02-25", company_id: 16 },
    { id: 17, username: "oliver_walker", password: "oliverSecure", create_date: "2024-04-05", update_date: "2024-02-26", company_id: 17 },
    { id: 18, username: "paul_allen", password: "paulPass", create_date: "2024-04-10", update_date: "2024-02-27", company_id: 18 },
    { id: 19, username: "quinn_jackson", password: "quinnSecure", create_date: "2024-04-15", update_date: "2024-02-28", company_id: 19 },
    { id: 20, username: "rachel_davis", password: "rachelPass", create_date: "2024-04-20", update_date: "2024-02-29", company_id: 20 },
  ];
  
  
  expenses = [
    { id: 1, cost: '1000', amount: '5000', status: false, category: 'Fixed', rateType: 'Hourly', type: 'Amount or Percentage', value: 'idk' }
  ];
  
  getData() {
    return this.data;
  }
  getCompany() {
    return this.company;
  }
  getUsers() {
    return this.users;
  }
  getProjects() {
    return this.projects;
  }
  getAsset() {
    return this.asset;
  }

  getExpenses() {
    return this.expenses;
  }
}
