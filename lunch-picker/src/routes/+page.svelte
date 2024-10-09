<script>
    import Geolocation from "svelte-geolocation";

    $: coords = [];
    let address = '';
    let radius = 0;  

    let restaurantSelected;
    async function submitForm(event) {
         event.preventDefault();  
        if(coords) {
            fetchLocations(coords[0], coords[1], radius).then((allRestaurants) => {
                const randomIndex = Math.floor(Math.random() * allRestaurants.length);
                //add a filter for open restaurants only
                restaurantSelected = allRestaurants[randomIndex];
            })
        } else {
            console.error('Missing Coords enable browser to access your location or enter manually');
        }
    }


    async function fetchLocations(longitude, latitude, radius) {
        try {
            const miles = radius * 1609.344
            const res = await fetch(`http://localhost:3000/api/restaurants?latitude=${latitude}&longitude=${longitude}&radius=${Math.floor(miles)}&categories=restaurants`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json(); 
            console.log('data', data.businesses)
            const allData = data.businesses || []; 
            return allData
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    }

</script>
  
<!-- Form -->
<form on:submit={submitForm}>
<label for="number">Enter a radius distance from you in miles:</label>
<input type="number" id="number" bind:value={radius} />
{#if coords.length === 0}
    <label for="address">Enter a address:</label>
    <input type="text" id="address" bind:value={address} />
{/if}

<button type="submit">Submit</button>
</form>

<Geolocation getPosition bind:coords />

{#if restaurantSelected}
<ul>
    <li> 
        <img src={restaurantSelected.image_url} alt={restaurantSelected.name} width="500" height="600"> 
    </li>
    <li>Name: {restaurantSelected.name}</li>
    <li>Phone: {restaurantSelected.display_phone}</li>
    <li>Rating: {restaurantSelected.rating}</li>
    <li>
        {#each restaurantSelected.location.display_address as address}
            <span>{address}</span>
        {/each}
    </li>
    {#if restaurantSelected.attributes.menu_url}
        <li>Menu: <a href={restaurantSelected.attributes.menu_url}>{restaurantSelected.attributes.menu_url}</a> </li>
    {/if}
</ul>
{/if}

<style>
    span {
        display: flex;
        flex-direction: column;
    }
</style>