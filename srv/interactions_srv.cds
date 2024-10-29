using tabs from '../db/interactions';

service Catalog {

 entity MediaFile as projection on tabs.Pictures;
    entity tUSER as projection on tabs.user_information;
    entity JOBlogs as projection on tabs.GET_JOBS;
    entity E_LEARN as projection on tabs.E_LEARN;
    function HiTSocket(DATA : String) returns String;
    function onWaiting(ID:String)              returns String;
    action onPost(DATA:LargeString)

}
