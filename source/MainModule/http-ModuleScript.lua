--[[
	Provides the Promotion centre with interactions with Polaris servers.
--]]
local HttpService = game:GetService("HttpService")


local Class = {
	base = "",
	security = "POLARIS_RANK_SYSTEM_2KEn" -- Probably doesn't need changed
	}
Class.__index = Class

function Class.new(token, id)
	local newClass = {}
    setmetatable(newClass, Class)
	
	-- Set properties from args
	newClass.token = token
	newClass.id = id
	newClass.valid = false
	
    return newClass
end

function Class:check()
	-- If already checked
	if self.valid then return true end
	-- Make the request
	local url = self.base .. "/centres/" ..self.id
	local res = self:get(url)
	
	if res.error or res.active == false then
		self.valid = false
		warn("Centre is not active!")
		return res
	else
		self.valid = true
		return true
	end
end

function Class:setRank(id, group, rank)
	if not self.valid then return false end
	print("Ranking")
	local url = self.base .. "/centres/" ..self.id .."/rank/"..group
	-- Make request
	local res = self:post(url, {
		newRank = rank,
		userId = id
		})
	if res.error then
		return res
	else
		print("Ranked")
		return true
	end
	
end

function Class:get(url, headers)
	-- Set auth header
	if not headers then headers = {} end
	headers.Authorization = self.security .. ":" .. self.token
	local data, response
	local success, err = pcall(function()
		response = HttpService:RequestAsync({
			Url = url,
			Method = "GET",
			Headers = headers
		})
		data = HttpService:JSONDecode(response.Body) 
	end)
	
	-- Return error for json decode/http error
	if not success then
		warn("Polaris HTTP: Error when GET "..url)
		warn(err)
		return {error = {message = err}}
	end
	
	-- Deal with the response
	if response.Success then
		return data
	else
		-- Return the error
		warn("Polaris HTTP: Error when GET "..url)
		warn(data.error.message)
		return data
	end
end

function Class:post(url, body, headers)
	-- Set headers
	if not headers then headers = {} end
	headers.Authorization = self.security .. ":" .. self.token
	headers["Content-Type"] = "application/json"
	
	-- Make request
	local data, response
	local success, err = pcall(function()
		response = HttpService:RequestAsync({
			Url = url,
			Method = "POST",
			Headers = headers,
			Body = HttpService:JSONEncode(body)
		})
		data = HttpService:JSONDecode(response.Body) 
		
	end)
	
		-- Return error for json decode/http error
	if not success then
		warn("Polaris HTTP: Error 1 when POST "..url)
		warn(err)
		return {error = {message = err}}
	end
	
	-- Deal with the response
	if response.Success then
		return data
	else
		-- Return the error
		warn("Polaris HTTP: Error when POST "..url)
		if data.error then
			warn(data.error.status .. data.error.message)
		else
			warn(data.error)
		end
		
		return data
	end
end
function printTable(t, tabs)
    local tabs = tabs and tabs + 1 or 0
    for i,v in next,t do
        if type(v) == "table" then
            if type(i) == "string" then
                print(string.rep("    ", tabs).."[\""..i.."\"] = {")
            else
                print(string.rep("    ", tabs)..tostring(i).." = {")
            end
            printTable(v, tabs)
            print(string.rep("    ", tabs).."}",(tabs > 0 and ";" or ""))
        else
            if type(i) == "string" then
                print(string.rep("    ", tabs).."[\""..i.."\"] =",v,";")
            else
                print(string.rep("    ", tabs)..tostring(i).." =",v,";")
            end
        end
    end    
end

return Class