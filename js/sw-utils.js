


function actualizaCacheDinamico( dymanicCache, request, response)
{
    if (response.ok)
    {
        return caches.open ( dymanicCache ).then( cache => {

            cache.put( request, response.clone() );
            return response.clone();
        });
    }
    else
    {
        return response;
    }
}